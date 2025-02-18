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
import useBrigadas from "@/hooks/useBrigadas";
import Loading from "@/components/Loader";
import MainInput from "@/components/BaseInputs/MainInput";
import AsyncAccordion from "@/components/AsyncAccordion";
import { Modal } from "antd";

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

const ApcModals = ({ modal, handleModal }: Props) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { mutate: attach, isPending: attaching } = attachBrigadaMutation();
  const { register, getValues, watch, handleSubmit } = useForm();

  const closeModal = () => handleModal(undefined);

  const { data: brigades, isFetching: brigadaLoading } = useBrigadas({
    enabled: false,
    department: Departments.APC,
    sphere_status: Sphere.retail,
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
    if (modal === ModalTypes.assign)
      return (
        <div>
          <Header title="select_handler">
            {/* <button onClick={closeModal}>
              <span aria-hidden="true">&times;</span>
            </button> */}
          </Header>
          <div className={"overflow-y-auto mt-2"}>
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
                      className="btn btn-success btn-sm"
                    >
                      {t("assign")}
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      );
    if (modal === ModalTypes.cancelRequest)
      return (
        <form
          onSubmit={handleSubmit(
            handleBrigada({
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
    if (modal === ModalTypes.pause)
      return (
        <form
          onSubmit={handleSubmit(
            handleBrigada({ status: RequestStatus.paused })
          )}
        >
          <Header title="pause_reason">
            {/* <button onClick={closeModal} className="close">
              <span aria-hidden="true">&times;</span>
            </button> */}
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

    if (modal === ModalTypes.expense)
      return (
        <form
          onSubmit={handleSubmit(
            handleBrigada({ status: RequestStatus.solved })
          )}
        >
          <Header title="add_expense" />
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

    // if (modal === ModalTypes.showPhoto)
    //   return (
    //     <div className={"relative"}>
    //       <button
    //         onClick={closeModal}
    //         className={cl(
    //           "absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center border border-white"
    //         )}
    //       >
    //         <span aria-hidden="true">&times;</span>
    //       </button>
    //       <Link to={photo || ""} target="_blank" rel="noopener noreferrer">
    //         {photo && detectFileType(photo) === FileType.photo ? (
    //           <img
    //             src={photo}
    //             className={"max-h-[80vh] max-w-[80vw] block h-full"}
    //             alt="uploaded-file"
    //           />
    //         ) : (
    //           <video
    //             src={photo || ""}
    //             className={"max-h-[80vh] max-w-[80vw] block h-full"}
    //             controls
    //           />
    //         )}
    //       </Link>
    //     </div>
    //   );

    if (modal === ModalTypes.changeCateg)
      return <AsyncAccordion closeModal={closeModal} />;
  };

  if (orderFetching || attaching) return <Loading />;

  return (
    <Modal
      // onClose={closeModal}
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

export default ApcModals;
