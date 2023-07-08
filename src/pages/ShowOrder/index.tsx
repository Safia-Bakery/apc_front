import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddProduct from "src/components/AddProduct";
import Card from "src/components/Card";
import Header from "src/components/Header";
import Modal from "src/components/Modal";
import styles from "./index.module.scss";

const ShowOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [modal, $modal] = useState(false);

  const handleModal = () => $modal((prev) => !prev);

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
                    <td>Прочие</td>
                  </tr>
                  <tr>
                    <th>Отдел</th>
                    <td>S МедГор</td>
                  </tr>
                  <tr>
                    <th>Продукт</th>
                    <td>Освежитель балончик</td>
                  </tr>
                  <tr>
                    <th>Фото</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Примичание</th>
                    <td>Надо срочна поменять 3шт </td>
                  </tr>
                  <tr>
                    <th>Статус</th>
                    <td>Назначен</td>
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
                    <td>Да</td>
                  </tr>
                  <tr>
                    <th>Забрал для </th>
                    <td>Нет</td>
                  </tr>
                  <tr>
                    <th>Дата выполнения</th>
                    <td>-</td>
                  </tr>
                  <tr>
                    <th>Изменил</th>
                    <td>Арс Розница</td>
                  </tr>
                  <tr>
                    <th>Дата изменение</th>
                    <td>06.07.2023 13:30</td>
                  </tr>
                  <tr>
                    <th>Дата</th>
                    <td>06.07.2023 13:09</td>
                  </tr>
                  <tr>
                    <th>Автор</th>
                    <td>Медгородок Магазин</td>
                  </tr>
                  <tr className="font-weight-bold">
                    <th>Ответственный</th>
                    <td>
                      <button
                        onClick={handleModal}
                        className="btn btn-success btn-fill float-end"
                      >
                        Назначить
                      </button>
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
          {[...Array(6)].map((item, idx) => (
            <div key={idx} className={styles.item}>
              <h6>Бригада - № {idx}</h6>
              <button
                onClick={handleModal}
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
