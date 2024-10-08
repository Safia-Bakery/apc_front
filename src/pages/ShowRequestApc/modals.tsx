import cl from "classnames";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Modal from "@/components/Modal";
import {
  BrigadaType,
  Departments,
  FileType,
  ModalTypes,
  RequestStatus,
  Sphere,
} from "@/utils/types";
import Header from "@/components/Header";
import BaseInput from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import { CancelReason, detectFileType } from "@/utils/helpers";
import MainSelect from "@/components/BaseInputs/MainSelect";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import useOrder from "@/hooks/useOrder";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import useQueryString from "custom/useQueryString";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import useBrigadas from "@/hooks/useBrigadas";
import Loading from "@/components/Loader";
import useCategories from "@/hooks/useCategories";
import MainInput from "@/components/BaseInputs/MainInput";

interface Params {
  status?: RequestStatus;
  item?: BrigadaType;
  time?: string;
  car_id?: number;
}

const ApcModals = () => {
  const { t } = useTranslation();
  const navigateParams = useNavigateParams();
  const { id } = useParams();
  const modal = Number(useQueryString("modal"));
  const photo = useQueryString("photo");
  const sphere_status = Number(useQueryString("sphere_status"));
  const dep = Number(useQueryString("dep"));
  const removeParams = useRemoveParams();
  const { mutate: attach, isPending: attaching } = attachBrigadaMutation();
  const { register, getValues, watch, handleSubmit } = useForm();

  const closeModal = () => removeParams(["modal"]);

  const handleChangeCateg = () => {
    const { category_id } = getValues();
    attach(
      {
        request_id: Number(id),
        ...(category_id && { category_id }),
      },
      {
        onSuccess: () => {
          navigateParams({ modal: ModalTypes.assign });
          orderRefetch();
          successToast("assigned");
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const { data: order } = useOrder({ id: Number(id) });

  const { data: categories, isLoading: categoryLoading } = useCategories({
    enabled:
      !!order?.category?.id &&
      order?.status === RequestStatus.new &&
      sphere_status === Sphere.fabric,
    department: Departments.APC,
    sphere_status: Sphere.fabric,
    parent_id: Number(order?.category?.id),
    category_status: 1,
  });

  const { data: brigades, isFetching: brigadaLoading } = useBrigadas({
    enabled: false,
    ...(!!dep && { department: dep }),
    ...(!!sphere_status && { sphere_status }),
  });

  const { refetch: orderRefetch, isFetching: orderFetching } = useOrder({
    id: Number(id),
  });

  const handleBrigada =
    ({ status, item, time, car_id }: Params) =>
    () => {
      const { fixedReason, cancel_reason, pause_reason, price } = getValues();
      attach(
        {
          request_id: Number(id),
          status,
          ...(!!time && { finishing_time: time }),
          ...(!!car_id && { car_id }),
          ...(!!price && { price: +price }),
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
      closeModal();
    };

  const renderModal = () => {
    switch (modal) {
      case ModalTypes.assign:
        return (
          <div className={"w-[420px]"}>
            <Header title="select_handler">
              <button onClick={closeModal}>
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
      case ModalTypes.cancelRequest:
        return (
          <form
            onSubmit={handleSubmit(
              handleBrigada({
                status: RequestStatus.closed_denied,
              })
            )}
            className={"w-[420px]"}
          >
            <Header title="deny_reason">
              <button onClick={closeModal} className="close">
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
              <button onClick={closeModal} className="close">
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

      case ModalTypes.expense:
        return (
          <form
            onSubmit={handleSubmit(
              handleBrigada({ status: RequestStatus.solved })
            )}
          >
            <Header title="add_expense">
              <button onClick={closeModal}>
                <span aria-hidden="true">&times;</span>
              </button>
            </Header>
            <div className="p-3">
              <BaseInput label="add_expense">
                <MainInput type="number" register={register("price")} />
              </BaseInput>

              <button className="btn btn-success w-full" type="submit">
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

      case ModalTypes.changeCateg:
        return (
          <>
            <BaseInput label="select_category">
              <MainSelect
                values={categories?.items}
                register={register("category_id")}
              />
            </BaseInput>

            <button
              className="btn btn-success w-full"
              onClick={handleChangeCateg}
            >
              {t("apply")}
            </button>
          </>
        );

      default:
        return;
    }
  };

  if (
    (!!order?.category?.id &&
      order?.status === RequestStatus.new &&
      sphere_status === Sphere.fabric &&
      categoryLoading) ||
    orderFetching ||
    attaching
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

export default ApcModals;
