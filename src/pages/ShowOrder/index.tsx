import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

const ShowOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modal, $modal] = useState(false);
  const { mutate: attach } = attachBrigadaMutation();

  const brigades = useAppSelector(brigadaSelector);

  const { data: order, refetch: orderRefetch } = useOrder({ id: Number(id) });

  const handleModal = () => $modal((prev) => !prev);

  const handleBrigada = (brigada_id: number) => () => {
    attach(
      {
        request_id: Number(id),
        brigada_id,
      },
      {
        onSuccess: () => {
          orderRefetch();
          successToast("assigned");
        },
      }
    );

    handleModal();
  };

  const goBack = () => navigate(-1);
  return (
    <>
      <Card>
        <Header title={`#${id}`}>
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
                        <a target="_blank" href={`${baseURL}/${item.url}`}>
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
                    <td>{order?.status}</td>
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
                        ? dayjs(order?.finished_at).format("DD-MMM-YYYY HH:mm")
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
                      {dayjs(order?.created_at).format("DD-MMM-YYYY HH:mm")}
                    </td>
                  </tr>
                  <tr>
                    <th>Дата</th>
                    <td>{dayjs(new Date()).format("DD-MMM-YYYY HH:mm")}</td>
                  </tr>
                  <tr>
                    <th>Автор</th>
                    <td>{order?.fillial.name}</td>
                  </tr>
                  <tr className="font-weight-bold">
                    <th>Ответственный</th>
                    <td>
                      {order?.brigada?.name ? (
                        order?.brigada.name
                      ) : (
                        <button
                          onClick={handleModal}
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

          <div className="text-right mb10">
            <button className="btn btn-warning btn-fill mr-2">
              Забрать для ремонта
            </button>
            <button className="btn btn-success btn-fill">Починил</button>
          </div>
        </div>
      </Card>

      <AddProduct />

      <Modal
        onClose={handleModal}
        isOpen={modal}
        className={styles.assignModal}
      >
        <Header title="Выберите исполнителя">
          <button onClick={handleModal} className="close">
            <span aria-hidden="true">&times;</span>
          </button>
        </Header>
        <input type="text" className="form-control" />
        <div className={styles.items}>
          {brigades.map((item, idx) => (
            <div key={idx} className={styles.item}>
              <h6>{item.name}</h6>
              <button
                onClick={handleBrigada(item.id)}
                className="btn btn-success btn-fill btn-sm"
              >
                Назначить
              </button>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default ShowOrder;
