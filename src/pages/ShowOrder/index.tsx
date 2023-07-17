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
import BaseSelect from "src/components/BaseSelect";
import { CancelReason, handleStatus } from "src/utils/helpers";
import { useForm } from "react-hook-form";
import { BrigadaType, RequestStatus } from "src/utils/types";

const enum ModalTypes {
  closed = "closed",
  cancelRequest = "cancelRequest",
  assign = "assign",
}

const ShowOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modal, $modal] = useState<ModalTypes>(ModalTypes.closed);
  const { mutate: attach } = attachBrigadaMutation();
  const handleModal = (type: ModalTypes) => () => $modal(type);
  const [brigada, $brigada] = useState<{ id: number; name: string }>();
  const { register, getValues } = useForm();

  const brigades = useAppSelector(brigadaSelector);

  console.log(brigada?.name);

  const selectBrigada = (item: BrigadaType) => () => {
    $brigada({ id: item.id, name: item.name });
    $modal(ModalTypes.closed);
  };

  const { data: order, refetch: orderRefetch } = useOrder({ id: Number(id) });

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

  const renderModal = useMemo(() => {
    if (modal === ModalTypes.assign)
      return (
        <>
          <Header title="Выберите исполнителя">
            <button onClick={handleModal(ModalTypes.closed)} className="close">
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
        </>
      );
    if (modal === ModalTypes.cancelRequest)
      return (
        <>
          <Header title="Выберите исполнителя">
            <button onClick={handleModal(ModalTypes.closed)} className="close">
              <span aria-hidden="true">&times;</span>
            </button>
          </Header>
          <div className="p-3">
            <div className="form-group">
              <label>Выберите причину</label>
              <select
                defaultValue={"Select Item"}
                {...register("cancel_reason")}
                className="form-select"
              >
                {CancelReason?.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Комментарии</label>
              <textarea
                rows={4}
                {...register("cancel_reason")}
                className={`form-control ${styles.textArea}`}
                name="description"
                placeholder="Комментарии"
              />
            </div>

            <button
              className=""
              onClick={handleBrigada({ status: RequestStatus.rejected })}
            >
              otpravit
            </button>
          </div>
        </>
      );

    return;
  }, [modal]);

  useEffect(() => {
    if (order?.brigada?.name && order?.brigada?.id)
      $brigada({ id: order.brigada.id, name: order.brigada.name });
  }, [order?.brigada]);

  const goBack = () => navigate(-1);
  return (
    <>
      <Card>
        <Header title={`Заказ №${id}`}>
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
                        <a
                          target="_blank"
                          key={item.url}
                          href={`${baseURL}/${item.url}`}
                        >
                          {item.url}
                        </a>
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
                    <th>Забрал для </th>
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
                    <td>{order?.fillial.name}</td>
                  </tr>
                  <tr className="font-weight-bold">
                    <th>Ответственный</th>
                    <td>
                      {brigada?.name ? (
                        <>
                          <span>{brigada?.name}</span>
                          <button
                            onClick={handleModal(ModalTypes.assign)}
                            className="btn btn-primary btn-fill float-end"
                          >
                            Переназначить
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={handleModal(ModalTypes.assign)}
                          className="btn btn-success btn-fill float-end"
                        >
                          Назначить
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <hr />

          {order?.status !== RequestStatus.confirmed &&
            order?.status !== RequestStatus.rejected &&
            order?.status !== RequestStatus.done && (
              <div className="d-flex justify-content-between mb10">
                <button
                  onClick={handleModal(ModalTypes.cancelRequest)}
                  className="btn btn-danger btn-fill"
                >
                  Отменить
                </button>
                <div className="">
                  <button
                    onClick={handleBrigada({
                      status: RequestStatus.sendToRepair,
                    })}
                    className="btn btn-warning btn-fill mr-2"
                  >
                    Забрать для ремонта
                  </button>
                  <button
                    onClick={handleBrigada({ status: RequestStatus.done })}
                    className="btn btn-success btn-fill"
                  >
                    Починил
                  </button>
                </div>
              </div>
            )}
        </div>
      </Card>

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
