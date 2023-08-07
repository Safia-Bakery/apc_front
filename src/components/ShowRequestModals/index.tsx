import { useMemo } from "react";
import Modal from "../Modal";
import { brigadaSelector } from "src/redux/reducers/cache";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import { BrigadaType, FileType, RequestStatus } from "src/utils/types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import {
  selectBrigada,
  selectedBrigadaSelector,
} from "src/redux/reducers/selects";

const enum ModalTypes {
  closed = "closed",
  cancelRequest = "cancelRequest",
  assign = "assign",
  showPhoto = "showPhoto",
}

const ShowRequestModals = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const modal = searchParams.get("modal");
  const photo = searchParams.get("photo");
  const { mutate: attach } = attachBrigadaMutation();
  const handleModal = (type: string) => navigate(type);
  const { register, getValues } = useForm();
  const dispatch = useAppDispatch();
  const brigada = useAppSelector(selectedBrigadaSelector);

  const brigades = useAppSelector(brigadaSelector);
  const { refetch: orderRefetch } = useOrder({ id: Number(id) });
  const selectedBrigada = (item: BrigadaType) => () => {
    handleModal("?");
    dispatch(selectBrigada({ id: item.id, name: item.name, order: id! }));
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
      handleModal("?");
    };

  const renderModal = useMemo(() => {
    switch (modal) {
      case ModalTypes.assign:
        return (
          <div className={styles.birgadesModal}>
            <Header title="Выберите исполнителя">
              <button onClick={() => handleModal("?")} className="close">
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
              <button onClick={() => handleModal("?")} className="close">
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
              onClick={() => handleModal("?")}
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
        return null;
    }
  }, [modal]);

  return (
    <Modal
      onClose={() => handleModal("?")}
      isOpen={!!modal}
      className={styles.assignModal}
    >
      {renderModal}
    </Modal>
  );
};

export default ShowRequestModals;
