import cl from "classnames";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  BrigadaType,
  Departments,
  ModalTypes,
  RequestStatus,
  Sphere,
} from "@/utils/types";
import Header from "@/components/Header";
import BaseInput from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import { CancelReason } from "@/utils/helpers";
import MainSelect from "@/components/BaseInputs/MainSelect";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import useOrder from "@/hooks/useOrder";
import attachBrigadaMutation from "@/hooks/mutation/attachBrigadaMutation";
import useQueryString from "custom/useQueryString";
import useBrigadas from "@/hooks/useBrigadas";
import Loading from "@/components/Loader";
import MainInput from "@/components/BaseInputs/MainInput";
import AsyncAccordion from "@/components/AsyncAccordion";
import { Modal } from "antd";
import { editAddAppointment, getAppointments } from "@/hooks/hr-registration";

interface Params {
  status?: RequestStatus;
  item?: BrigadaType;
  time?: string;
  car_id?: number;
}

interface Props {
  handleModal: (arg: ModalTypes | undefined) => void;
  modal: ModalTypes | undefined;
}

const HRRequestModals = ({ modal, handleModal }: Props) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { register, getValues, watch, handleSubmit } = useForm();

  const { refetch, isRefetching } = getAppointments({
    enabled: false,
    page: 1,
  });

  const closeModal = () => handleModal(undefined);

  const { refetch: orderRefetch, isFetching: orderFetching } = useOrder({
    id: Number(id),
  });

  const { mutate, isPending: attaching } = editAddAppointment();
  const handleRequest = ({ status }: { status: RequestStatus }) => {
    const { fixedReason, cancel_reason } = getValues();
    mutate(
      {
        id: Number(id),
        status,
        ...(status === RequestStatus.closed_denied && {
          deny_reason:
            fixedReason < 4 ? t(CancelReason[fixedReason]) : cancel_reason,
        }),
      },
      {
        onSuccess: () => {
          orderRefetch();
          refetch();
          successToast("assigned");
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const renderModal = () => {
    if (modal === ModalTypes.cancelRequest)
      return (
        <form
          onSubmit={handleSubmit(() =>
            handleRequest({
              status: RequestStatus.closed_denied,
            })
          )}
        >
          <Header title="deny_reason" />
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
  };

  if (orderFetching || attaching) return <Loading />;

  return (
    <Modal
      closable
      classNames={{ content: "!p-0" }}
      onCancel={closeModal}
      open={!!modal}
      footer={null}
      className={cl("!h-[400px] w-min min-w-56 p-1 overflow-y-auto")}
    >
      {renderModal()}
    </Modal>
  );
};

export default HRRequestModals;
