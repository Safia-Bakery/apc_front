import { useMemo } from "react";
import Modal from "../Modal";
import { brigadaSelector } from "src/redux/reducers/cache";
import { useAppSelector } from "src/redux/utils/types";
import { BrigadaType, FileType, RequestStatus } from "src/utils/types";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "./index.module.scss";
import Header from "../Header";
import BaseInput from "../BaseInputs";
import MainTextArea from "../BaseInputs/MainTextArea";
import { CancelReason, detectFileType } from "src/utils/helpers";
import MainSelect from "../BaseInputs/MainSelect";
import { successToast } from "src/utils/toast";
import useOrder from "src/hooks/useOrder";
import attachBrigadaMutation from "src/hooks/mutation/attachBrigadaMutation";
import cl from "classnames";
import { selectedBrigadaSelector } from "src/redux/reducers/selects";
import useQueryString from "src/hooks/useQueryString";
import {
  useNavigateParams,
  useRemoveParams,
} from "src/hooks/useCustomNavigate";

const enum ModalTypes {
  closed = "closed",
  cancelRequest = "cancelRequest",
  assign = "assign",
  showPhoto = "showPhoto",
}

const ShowRequestModals = () => {
  const { id } = useParams();
  const modal = useQueryString("modal");
  const photo = useQueryString("photo");

  const customnavigate = useNavigateParams();
  const removeParams = useRemoveParams();

  const { mutate: attach } = attachBrigadaMutation();
  const { register, getValues } = useForm();
  const brigada = useAppSelector(selectedBrigadaSelector);

  const brigades = useAppSelector(brigadaSelector);
  const { refetch: orderRefetch } = useOrder({ id: Number(id) });
  const selectedBrigada = (item: BrigadaType) => () => {
    customnavigate({
      brigada: JSON.stringify({
        id: item.id,
        name: item.name,
        order: id!,
      }),
      modal: ModalTypes.closed,
    });
  };

  const handleBrigada =
    ({ status }: { status: RequestStatus }) =>
    () => {
      attach(
        {
          request_id: Number(id),
          brigada_id: Number(brigada?.id),
          status,
          comment: getValues("cancel_reason"),
        },
        {
          onSuccess: () => {
            orderRefetch();
            successToast("assigned");
          },
        }
      );
      removeParams(["modal"]);
    };

  const renderModal = useMemo(() => {
    switch (modal) {
      case ModalTypes.assign:
        return (
          <div className={styles.birgadesModal}>
            <Header title="Выберите исполнителя">
              <button onClick={() => removeParams(["modal"])} className="close">
                <span aria-hidden="true">&times;</span>
              </button>
            </Header>
            <div className={styles.items}>
              {brigades.map((item, idx) => (
                <div key={idx} className={styles.item}>
                  <h6>{item?.name}</h6>
                  <button
                    onClick={selectedBrigada(item)}
                    className="btn btn-success btn-fill btn-sm"
                  >
                    Назначить
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case ModalTypes.cancelRequest:
        return (
          <div className={styles.birgadesModal}>
            <Header title="Выберите исполнителя">
              <button onClick={() => removeParams(["modal"])} className="close">
                <span aria-hidden="true">&times;</span>
              </button>
            </Header>
            <div className="p-3">
              <BaseInput label="Выберите причину">
                <MainSelect
                  values={CancelReason}
                  register={register("cancel_reason")}
                />
              </BaseInput>

              <BaseInput label="Комментарии">
                <MainTextArea register={register("cancel_reason")} />
              </BaseInput>

              <button
                className="btn btn-success"
                onClick={handleBrigada({ status: RequestStatus.rejected })}
              >
                Отправить
              </button>
            </div>
          </div>
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
            {photo && detectFileType(photo) === FileType.photo ? (
              <img src={photo} className={styles.image} alt="uploaded-file" />
            ) : (
              <video src={photo || ""} className={styles.image} controls />
            )}
          </div>
        );

      default:
        return;
    }
  }, [modal]);

  return (
    <Modal
      onClose={() => removeParams(["modal", !!photo ? "photo" : ""])}
      isOpen={!!modal && modal !== ModalTypes.closed}
      className={styles.assignModal}
    >
      {renderModal}
    </Modal>
  );
};

export default ShowRequestModals;
