import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddProduct from "src/components/AddProduct";
import Card from "src/components/Card";
import Header from "src/components/Header";
import Modal from "src/components/Modal";
import styles from "./index.module.scss";
import useOrder from "src/hooks/useOrder";
import dayjs from "dayjs";
import { useAppSelector } from "src/redux/utils/types";
import { brigadaSelector } from "src/redux/reducers/cacheResources";
import attachBrigadaMutation from "src/hooks/mutation/attachBrigadaMutation";
import { successToast } from "src/utils/toast";
import { baseURL } from "src/main";
import { CancelReason, detectFileType, handleStatus } from "src/utils/helpers";
import { useForm } from "react-hook-form";
import { BrigadaType, FileType, RequestStatus } from "src/utils/types";
import { roleSelector } from "src/redux/reducers/authReducer";
import UploadComponent, { FileItem } from "src/components/FileUpload";
import cl from "classnames";
import BaseInput from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import MainTextArea from "src/components/BaseInputs/MainTextArea";

const enum ModalTypes {
  closed = "closed",
  cancelRequest = "cancelRequest",
  assign = "assign",
  showPhoto = "showPhoto",
}

const ShowOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modal, $modal] = useState<ModalTypes>(ModalTypes.closed);
  const { mutate: attach } = attachBrigadaMutation();
  const handleModal = (type: ModalTypes) => () => $modal(type);
  const [brigada, $brigada] = useState<{ id: number; name: string }>();
  const { register, getValues } = useForm();
  const [files, $files] = useState<FormData>();
  const [photo, $photo] = useState<string>();
  const brigades = useAppSelector(brigadaSelector);
  const me = useAppSelector(roleSelector);

  const selectBrigada = (item: BrigadaType) => () => {
    $brigada({ id: item.id, name: item.name });
    $modal(ModalTypes.closed);
  };

  const handleNavigate = (route: string) => () => navigate(route);

  const { data: order, refetch: orderRefetch } = useOrder({ id: Number(id) });

  const handleFilesSelected = (data: FileItem[]) => {
    const formData = new FormData();
    data.forEach((item) => {
      formData.append("files", item.file, item.file.name);
    });
    $files(formData);
  };

  const handleShowPhoto = (file: string) => () => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else {
      $photo(file);
      $modal(ModalTypes.showPhoto);
    }
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
      $modal(ModalTypes.closed);
    };

  const renderBtns = useMemo(() => {
    if (me?.permissions.ismanager && order?.status === 0 && !!brigada?.name)
      return (
        <div className="float-end mb10">
          <button
            onClick={handleModal(ModalTypes.cancelRequest)}
            className="btn btn-danger btn-fill mr-2"
          >
            Отклонить
          </button>
          <button
            onClick={handleBrigada({ status: RequestStatus.confirmed })}
            className="btn btn-success btn-fill"
          >
            Принять
          </button>
        </div>
      );
    if (me?.permissions.isbrigader)
      return (
        <div className="d-flex justify-content-between mb10">
          {order?.status! < 3 && (
            <button
              onClick={handleModal(ModalTypes.cancelRequest)}
              className="btn btn-danger btn-fill"
            >
              Отменить
            </button>
          )}
          <div>
            {order?.status! < 2 && (
              <button
                onClick={handleBrigada({
                  status: RequestStatus.sendToRepair,
                })}
                className="btn btn-warning btn-fill mr-2"
              >
                Забрать для ремонта
              </button>
            )}
            {order?.status! < 3 && (
              <button
                onClick={handleBrigada({ status: RequestStatus.done })}
                className="btn btn-success btn-fill"
              >
                Починил
              </button>
            )}
          </div>
        </div>
      );
  }, [me?.permissions, order?.status, brigada?.name]);

  const renderAssignment = useMemo(() => {
    if (me?.permissions.ismanager && order?.status === 0) {
      if (brigada?.name) {
        return (
          <>
            <span>{brigada?.name}</span>
            <button
              onClick={handleModal(ModalTypes.assign)}
              className="btn btn-primary btn-fill float-end"
            >
              Переназначить
            </button>
          </>
        );
      }
      return (
        <button
          onClick={handleModal(ModalTypes.assign)}
          className="btn btn-success btn-fill float-end"
        >
          Назначить
        </button>
      );
    }
    return <span>{brigada?.name}</span>;
  }, [me?.permissions, brigada?.name, order?.status]);

  const renderModal = useMemo(() => {
    switch (modal) {
      case ModalTypes.assign:
        return (
          <div className={styles.birgadesModal}>
            <Header title="Выберите исполнителя">
              <button
                onClick={handleModal(ModalTypes.closed)}
                className="close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </Header>
            <div className={styles.items}>
              {brigades.map((item, idx) => (
                <div key={idx} className={styles.item}>
                  <h6>{item?.name}</h6>
                  <button
                    onClick={selectBrigada(item)}
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
              <button
                onClick={handleModal(ModalTypes.closed)}
                className="close"
              >
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
              onClick={handleModal(ModalTypes.closed)}
              className={cl(styles.close, "close")}
            >
              <span aria-hidden="true">&times;</span>
            </button>
            {photo && detectFileType(photo) === FileType.photo ? (
              <img src={photo} className={styles.image} alt="uploaded-file" />
            ) : (
              <video src={photo} className={styles.image} controls />
            )}
          </div>
        );

      default:
        return;
    }

    return;
  }, [modal]);

  useEffect(() => {
    if (order?.brigada?.name && order?.brigada?.id)
      $brigada({ id: order.brigada.id, name: order.brigada.name });
  }, [order?.brigada]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goBack = () => navigate(-1);
  return (
    <>
      <Card>
        <Header title={`Заказ №${id}`}>
          <button
            className="btn btn-warning btn-fill mr-2"
            onClick={handleNavigate("/logs")}
          >
            Логи
          </button>
          <button className="btn btn-primary btn-fill" onClick={goBack}>
            Назад
          </button>
        </Header>
        <div className="content">
          <div className="row ">
            <div className="col-md-6">
              <table
                id="w0"
                className="table table-striped table-bordered detail-view"
              >
                <tbody>
                  <tr>
                    <th>Тип</th>
                    <td>APC</td>
                  </tr>
                  <tr>
                    <th>Группа проблем</th>
                    <td>{order?.category?.name}</td>
                  </tr>
                  <tr>
                    <th>Отдел</th>
                    <td>{order?.fillial?.name}</td>
                  </tr>
                  <tr>
                    <th>Продукт</th>
                    <td>{order?.product}</td>
                  </tr>
                  <tr>
                    <th>file</th>
                    <td className="d-flex flex-column">
                      {order?.file?.map((item) => (
                        <div
                          className={styles.imgUrl}
                          onClick={handleShowPhoto(`${baseURL}/${item.url}`)}
                          key={item.url}
                        >
                          {item.url}
                        </div>
                      ))}
                    </td>
                  </tr>
                  <tr>
                    <th>Примичание</th>
                    <td>{order?.description}</td>
                  </tr>
                  <tr>
                    <th>Статус</th>
                    <td>{handleStatus(order?.status)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-md-6">
              <table
                id="w1"
                className="table table-striped table-bordered detail-view"
              >
                <tbody>
                  <tr>
                    <th>Срочно</th>
                    <td>{!order?.urgent ? "Нет" : "Да"}</td>
                  </tr>
                  <tr>
                    <th>Забрал для</th>
                    <td>---------</td>
                  </tr>
                  <tr>
                    <th>Дата выполнения</th>
                    <td>
                      {order?.finished_at
                        ? dayjs(order?.finished_at).format("DD-MM-YYYY HH:mm")
                        : "В процессе"}
                    </td>
                  </tr>
                  <tr>
                    <th>Изменил</th>
                    <td>{order?.brigada?.name}</td>
                  </tr>
                  <tr>
                    <th>Дата изменение</th>
                    <td>
                      {dayjs(order?.created_at).format("DD-MM-YYYY HH:mm")}
                    </td>
                  </tr>
                  <tr>
                    <th>Дата</th>
                    <td>{dayjs(new Date()).format("DD-MM-YYYY HH:mm")}</td>
                  </tr>
                  <tr>
                    <th>Автор</th>
                    <td>{order?.fillial?.name}</td>
                  </tr>
                  <tr className="font-weight-bold">
                    <th>Ответственный</th>
                    <td>{renderAssignment}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          {renderBtns}
        </div>
      </Card>

      {me?.permissions.isbrigader && (
        <Card>
          <Header title={"Добавить фотоотчёт"} />
          <div className="m-3">
            <UploadComponent onFilesSelected={handleFilesSelected} />
          </div>
        </Card>
      )}

      <AddProduct />

      <Modal
        onClose={handleModal(ModalTypes.closed)}
        isOpen={modal !== ModalTypes.closed}
        className={styles.assignModal}
      >
        {renderModal}
      </Modal>
    </>
  );
};

export default ShowOrder;
