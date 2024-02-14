import Modal from "../Modal";
import {
  BrigadaType,
  FileType,
  MarketingSubDepRu,
  ModalTypes,
  RequestStatus,
} from "@/utils/types";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "./index.module.scss";
import Header from "../Header";
import BaseInput from "../BaseInputs";
import MainTextArea from "../BaseInputs/MainTextArea";
import { CancelReason, detectFileType } from "@/utils/helpers";
import MainSelect from "../BaseInputs/MainSelect";
import { errorToast, successToast } from "@/utils/toast";
import useOrder from "@/hooks/useOrder";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import cl from "classnames";
import useQueryString from "custom/useQueryString";
import { useRemoveParams } from "custom/useCustomNavigate";
import useBrigadas from "@/hooks/useBrigadas";
import Loading from "../Loader";
import marketingReassignMutation from "@/hooks/mutation/marketingReassign";
import useCategories from "@/hooks/useCategories";
import useCars from "@/hooks/useCars";
import { useTranslation } from "react-i18next";

const ShowRequestModals = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const modal = Number(useQueryString("modal"));
  const photo = useQueryString("photo");
  const sphere_status = Number(useQueryString("sphere_status"));
  const dep = Number(useQueryString("dep"));
  const removeParams = useRemoveParams();
  const { mutate: reassign, isPending: reassigning } =
    marketingReassignMutation();
  const { mutate: attach, isPending: attaching } = attachBrigadaMutation();
  const { register, getValues, watch, handleSubmit } = useForm();

  const { data: categories, isLoading: categoriesLoading } = useCategories({
    sub_id: Number(watch("direction")),
    enabled: !!watch("direction"),
    category_status: 1,
  });

  const { data: cars, isLoading: carLoading } = useCars({
    enabled: modal === ModalTypes.cars,
  });

  const { data: brigades, isFetching: brigadaLoading } = useBrigadas({
    enabled: false,
    ...(!!dep && { department: dep }),
    ...(!!sphere_status && { sphere_status }),
  });

  const { refetch: orderRefetch, isFetching: orderFetching } = useOrder({
    id: Number(id),
  });

  const handleReassign = () => {
    reassign(
      {
        id: Number(id),
        category_id: getValues("category_id"),
      },
      {
        onSuccess: () => {
          orderRefetch();
          successToast("assigned");
          removeParams(["modal"]);
        },
        onError: (e: any) => errorToast(e.message),
      }
    );
  };

  const handleBrigada =
    ({
      status,
      item,
      time,
      car_id,
    }: {
      status: RequestStatus;
      item?: BrigadaType;
      time?: string;
      car_id?: number;
    }) =>
    () => {
      const { fixedReason } = getValues();
      attach(
        {
          request_id: Number(id),
          status,
          ...(!!time && { finishing_time: time }),
          ...(!!car_id && { car_id }),
          ...(!!item && { brigada_id: Number(item?.id) }),
          ...(status === RequestStatus.rejected && {
            deny_reason:
              fixedReason < 4
                ? CancelReason[fixedReason]
                : getValues("cancel_reason"),
          }),
        },
        {
          onSuccess: () => {
            orderRefetch();
            successToast("assigned");
          },
          onError: (e: any) => errorToast(e.message),
        }
      );
      removeParams(["modal"]);
    };

  const renderModal = () => {
    switch (modal) {
      case ModalTypes.assign:
        return (
          <div className={styles.birgadesModal}>
            <Header title="select_handler">
              <button onClick={() => removeParams(["modal"])} className="close">
                <span aria-hidden="true">&times;</span>
              </button>
            </Header>
            <div className={styles.items}>
              {brigadaLoading ? (
                <Loading />
              ) : (
                brigades?.items
                  .filter((item) => !!item.user!?.length)
                  .map((item, idx) => (
                    <div key={idx} className={styles.item}>
                      <h6 className="text-lg">{item?.name}</h6>
                      <button
                        id="attach_to_bridaga"
                        onClick={handleBrigada({
                          status: RequestStatus.confirmed,
                          item,
                        })}
                        className="btn btn-success btn-fill btn-sm"
                      >
                        {t("assign")}
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        );
      case ModalTypes.cars:
        return (
          <div className={styles.birgadesModal}>
            <Header title="select_truck">
              <button onClick={() => removeParams(["modal"])} className="close">
                <span aria-hidden="true">&times;</span>
              </button>
            </Header>
            <div className={styles.items}>
              {carLoading ? (
                <Loading />
              ) : (
                cars
                  ?.filter((item) => !!item.status)
                  .map((item, idx) => (
                    <div key={idx} className={styles.item}>
                      <h6>
                        {item?.name} {item?.number}
                      </h6>
                      <button
                        id="attach_to_bridaga"
                        onClick={handleBrigada({
                          status: RequestStatus.sendToRepair,
                          car_id: item.id,
                        })}
                        className="btn btn-success btn-fill btn-sm"
                      >
                        {t("assign")}
                      </button>
                    </div>
                  ))
              )}
            </div>
          </div>
        );
      case ModalTypes.cancelRequest:
        return (
          <form
            onSubmit={handleSubmit(
              handleBrigada({ status: RequestStatus.rejected })
            )}
            className={styles.birgadesModal}
          >
            <Header title="deny_reason">
              <button onClick={() => removeParams(["modal"])} className="close">
                <span aria-hidden="true">&times;</span>
              </button>
            </Header>
            <div className="p-3">
              <BaseInput label="select_reason">
                <MainSelect
                  register={register("fixedReason", {
                    required: t("required_field"),
                  })}
                >
                  <option value={undefined} />

                  {Object.keys(CancelReason).map((item) => (
                    <option key={item} value={item}>
                      {CancelReason[+item]}
                    </option>
                  ))}
                </MainSelect>
              </BaseInput>

              {watch("fixedReason") == 4 && (
                <BaseInput label="comments">
                  <MainTextArea register={register("cancel_reason")} />
                </BaseInput>
              )}

              <button className="btn btn-success" type="submit">
                {t("send")}
              </button>
            </div>
          </form>
        );

      case ModalTypes.showPhoto:
        return (
          <div className={styles.imgBlock}>
            <button
              onClick={() => removeParams(["modal", "photo"])}
              className={cl(styles.close, "close")}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <Link to={photo || ""} target="_blank" rel="noopener noreferrer">
              {photo && detectFileType(photo) === FileType.photo ? (
                <img src={photo} className={styles.image} alt="uploaded-file" />
              ) : (
                <video src={photo || ""} className={styles.image} controls />
              )}
            </Link>
          </div>
        );

      // case ModalTypes.assingDeadline:
      //   return (
      //     <div className="min-w-[380px] p-4 ">
      //       <BaseInput label="Выберите дедлайн">
      //         <MainDatePicker
      //           showTimeSelect
      //           selected={
      //             !!deadline ? dayjs(deadline || undefined).toDate() : undefined
      //           }
      //           onChange={handleDeadline}
      //         />
      //       </BaseInput>

      //       <button
      //         onClick={handleBrigada({
      //           status: RequestStatus.confirmed,
      //           time: deadline?.toISOString(),
      //         })}
      //         className="btn btn-success btn-fill btn-sm float-end"
      //       >
      //         Принять
      //       </button>
      //     </div>
      //   );

      case ModalTypes.reassign:
        return (
          <div className="min-w-[380px] p-4">
            <BaseInput label="select_direction">
              <MainSelect
                values={MarketingSubDepRu}
                register={register("direction")}
              />
            </BaseInput>

            <BaseInput label="select_category">
              <MainSelect
                values={categories?.items || []}
                register={register("category_id", {
                  required: t("required_field"),
                })}
              />
            </BaseInput>

            <button
              onClick={handleReassign}
              className="btn btn-success btn-fill btn-sm float-end"
            >
              {t("redirect")}
            </button>
          </div>
        );

      default:
        return;
    }
  };

  if (
    (carLoading && modal === ModalTypes.cars) ||
    orderFetching ||
    (categoriesLoading && !!watch("direction")) ||
    attaching ||
    reassigning
  )
    return <Loading absolute />;

  return (
    <Modal
      onClose={() => removeParams(["modal", !!photo ? "photo" : ""])}
      isOpen={!!modal && modal !== ModalTypes.closed}
      className={cl(styles.assignModal, "!h-[400px]")}
    >
      {renderModal()}
    </Modal>
  );
};

export default ShowRequestModals;
