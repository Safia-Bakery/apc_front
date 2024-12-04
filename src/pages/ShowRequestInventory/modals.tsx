import cl from "classnames";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Modal from "@/components/Modal";
import {
  BrigadaType,
  FileType,
  ModalTypes,
  RequestStatus,
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
import { useRemoveParams } from "custom/useCustomNavigate";
import Loading from "@/components/Loader";
import { getInvRequest, invRequestMutation } from "@/hooks/inventory";

interface Params {
  status?: RequestStatus;
  item?: BrigadaType;
  time?: string;
  car_id?: number;
}

const InventoryModals = () => {
  const { t } = useTranslation();
  const { id, dep } = useParams();
  const modal = Number(useQueryString("modal"));
  const photo = useQueryString("photo");
  const removeParams = useRemoveParams();
  const { mutate, isPending: attaching } = invRequestMutation();
  const { register, getValues, watch, handleSubmit } = useForm();

  const closeModal = () => removeParams(["modal"]);

  const { refetch: orderRefetch, isFetching: orderFetching } = getInvRequest({
    id: Number(id),
    department: Number(dep),
  });

  const handleBrigada =
    ({ status }: Params) =>
    () => {
      const { fixedReason, cancel_reason, pause_reason } = getValues();
      mutate(
        {
          id: Number(id),
          department: Number(dep),
          status,
          ...(!!pause_reason && { pause_reason }),
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

      default:
        return;
    }
  };

  if (orderFetching || attaching) return <Loading />;

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

export default InventoryModals;
