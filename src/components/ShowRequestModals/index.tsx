import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import cl from "classnames";
import Modal from "../Modal";
import {
  BrigadaType,
  FileType,
  MarketingSubDepRu,
  ModalTypes,
  RequestStatus,
} from "@/utils/types";
import Header from "../Header";
import BaseInput from "../BaseInputs";
import MainTextArea from "../BaseInputs/MainTextArea";
import { CancelReason, detectFileType } from "@/utils/helpers";
import MainSelect from "../BaseInputs/MainSelect";
import { errorToast, successToast } from "@/utils/toast";
import useOrder from "@/hooks/useOrder";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import useQueryString from "custom/useQueryString";
import { useRemoveParams } from "custom/useCustomNavigate";
import useBrigadas from "@/hooks/useBrigadas";
import Loading from "../Loader";
import marketingReassignMutation from "@/hooks/mutation/marketingReassign";
import useCategories from "@/hooks/useCategories";
import useCars from "@/hooks/useCars";

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
        onError: (e) => errorToast(e.message),
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
      status?: RequestStatus;
      item?: BrigadaType;
      time?: string;
      car_id?: number;
    }) =>
    () => {
      const { fixedReason, cancel_reason, pause_reason } = getValues();
      attach(
        {
          request_id: Number(id),
          status,
          ...(!!time && { finishing_time: time }),
          ...(!!car_id && { car_id }),
          ...(!!pause_reason && { pause_reason }),
          ...(!!item && { brigada_id: Number(item?.id) }),
          ...(status === RequestStatus.closed_denied && {
            deny_reason:
              fixedReason < 4 ? t(CancelReason[fixedReason]) : cancel_reason,
          }),
        },
        {
          onSuccess: () => {
            orderRefetch();
            successToast("assigned");
          },
          onError: (e) => errorToast(e.message),
        }
      );
      removeParams(["modal"]);
    };

  const renderModal = () => {
    switch (modal) {
      case ModalTypes.assign:
        return (
          <div className={"w-[420px]"}>
            <Header title="select_handler">
              <button onClick={() => removeParams(["modal"])} className="close">
                <span aria-hidden="true">&times;</span>
              </button>
            </Header>
            <div className={"overflow-y-auto max-h-80 h-full mt-2"}>
              {brigadaLoading ? (
                <Loading is_static />
              ) : (
                brigades?.items
                  .filter((item) => !!item.user!?.length && !!item.status)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className={
                        "flex justify-between border-b border-b-black py-4 pr-1 pl-4 items-center"
                      }
                    >
                      <h6 className="text-lg mb-0">{item?.name}</h6>
                      <button
                        id="attach_to_bridaga"
                        onClick={handleBrigada({
                          status: RequestStatus.received,
                          item,
                        })}
                        className="btn btn-success   btn-sm"
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
          <div className={"w-[420px]"}>
            <Header title="select_truck">
              <button onClick={() => removeParams(["modal"])} className="close">
                <span aria-hidden="true">&times;</span>
              </button>
            </Header>
            <div className={"overflow-y-auto max-h-80 h-full mt-2"}>
              {carLoading ? (
                <Loading is_static />
              ) : (
                cars
                  ?.filter((item) => !!item.status)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      className={
                        "flex justify-between border-b border-b-black py-4 pr-1 pl-4 items-center"
                      }
                    >
                      <h6 className="mb-0">
                        {item?.name} {item?.number}
                      </h6>
                      <button
                        id="attach_to_bridaga"
                        onClick={handleBrigada({
                          status: RequestStatus.sent_to_fix,
                          car_id: item.id,
                        })}
                        className="btn btn-success   btn-sm"
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
              handleBrigada({ status: RequestStatus.closed_denied })
            )}
            className={"w-[420px]"}
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
                      {t(CancelReason[+item])}
                    </option>
                  ))}
                </MainSelect>
              </BaseInput>

              {watch("fixedReason") == 4 && (
                <BaseInput label="comments">
                  <MainTextArea register={register("cancel_reason")} />
                </BaseInput>
              )}

              <button className="btn btn-success w-full" type="submit">
                {t("send")}
              </button>
            </div>
          </form>
        );
      case ModalTypes.pause:
        return (
          <form
            onSubmit={handleSubmit(
              handleBrigada({ status: RequestStatus.paused })
            )}
            className={"w-[420px]"}
          >
            <Header title="pause_reason">
              <button onClick={() => removeParams(["modal"])} className="close">
                <span aria-hidden="true">&times;</span>
              </button>
            </Header>
            <div className="p-3">
              <BaseInput label="comments">
                <MainTextArea register={register("pause_reason")} autoFocus />
              </BaseInput>

              <button className="btn btn-success" type="submit">
                {t("send")}
              </button>
            </div>
          </form>
        );

      case ModalTypes.showPhoto:
        return (
          <div className={"relative"}>
            <button
              onClick={() => removeParams(["modal", "photo"])}
              className={cl(
                "absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center border border-white"
              )}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <Link to={photo || ""} target="_blank" rel="noopener noreferrer">
              {photo && detectFileType(photo) === FileType.photo ? (
                <img
                  src={photo}
                  className={"max-h-[80vh] max-w-[80vw] block h-full"}
                  alt="uploaded-file"
                />
              ) : (
                <video
                  src={photo || ""}
                  className={"max-h-[80vh] max-w-[80vw] block h-full"}
                  controls
                />
              )}
            </Link>
          </div>
        );

      // case ModalTypes.assingDeadline:
      //   return (
      //     <>
      //       <Header title="edit_deadline">
      //         <button onClick={() => removeParams(["modal"])} className="close">
      //           <span aria-hidden="true">&times;</span>
      //         </button>
      //       </Header>
      //       <div className="min-w-[380px] p-4">
      //         <BaseInput label="Выберите дедлайн">
      //           <MainDatePicker
      //             showTimeSelect
      //             selected={
      //               !!deadline
      //                 ? dayjs(deadline || undefined).toDate()
      //                 : undefined
      //             }
      //             onChange={handleDeadline}
      //           />
      //         </BaseInput>

      //         <button
      //           onClick={handleBrigada({
      //             time: deadline?.toISOString(),
      //           })}
      //           className="btn btn-success   btn-sm float-end"
      //         >
      //           Принять
      //         </button>
      //       </div>
      //     </>
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
              className="btn btn-success   btn-sm float-end"
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
    return <Loading />;

  return (
    <Modal
      onClose={() => removeParams(["modal", !!photo ? "photo" : ""])}
      isOpen={!!modal && modal !== ModalTypes.closed}
      className={cl("!h-[400px] w-min p-1 overflow-y-auto")}
    >
      {renderModal()}
    </Modal>
  );
};

export default ShowRequestModals;
