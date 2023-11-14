import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./index.module.scss";
import useOrder from "src/hooks/useOrder";
import dayjs from "dayjs";

const column = [
  { name: "№" },
  { name: "Действие" },
  { name: "Сотрудник" },
  { name: "Дата" },
  { name: "Минут" },
];

const Logs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleNavigate = () => navigate(-1);

  const { data: order } = useOrder({ id: Number(id) });
  return (
    <Card>
      <Header title={"Логи"}>
        <button onClick={handleNavigate} className="btn btn-primary btn-fill">
          Назад
        </button>
      </Header>

      <div className="table-responsive grid-view content">
        <table className="table table-hover">
          <thead>
            <tr>
              {column.map(({ name }) => (
                <th className={styles.tableHead} key={name}>
                  {name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr className="bg-blue">
              <td width="40">1</td>
              <td>Поступление заявки</td>
              <td>{order?.is_bot ? "Телеграм-бот" : "Веб-сайт"}</td>
              <td>
                {order?.created_at
                  ? dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")
                  : "Не задано"}
              </td>
              <td>-------</td>
            </tr>
            <tr className="bg-blue">
              <td width="40">2</td>
              <td>Назначение</td>
              <td>{order?.user_manager}</td>
              <td>
                {order?.started_at
                  ? dayjs(order?.started_at).format("DD.MM.YYYY HH:mm")
                  : "Не задано"}
              </td>
              <td>
                {!!dayjs(order?.started_at).diff(order?.created_at, "minutes")
                  ? dayjs(order?.started_at).diff(order?.created_at, "minutes")
                  : "Не задано"}
              </td>
            </tr>
            <tr className="bg-blue">
              <td width="40">3</td>
              <td>Отмена</td>
              <td>{order?.user_manager}</td>
              <td>
                {order?.started_at
                  ? dayjs(order?.started_at).format("DD.MM.YYYY HH:mm")
                  : "Не задано"}
              </td>
              <td>
                {!!dayjs(order?.finished_at).diff(order?.started_at, "minutes")
                  ? dayjs(order?.finished_at).diff(order?.started_at, "minutes")
                  : "Не задано"}
              </td>
            </tr>
            <tr className="bg-blue">
              <td width="40">4</td>
              <td>Завершение</td>
              <td>{order?.brigada?.name}</td>
              <td>
                {order?.finished_at
                  ? dayjs(order?.finished_at).format("DD.MM.YYYY HH:mm")
                  : "Не задано"}
              </td>
              <td>
                {!!dayjs(order?.finished_at).diff(order?.started_at, "minutes")
                  ? dayjs(order?.finished_at).diff(order?.started_at, "minutes")
                  : "Не задано"}
              </td>
            </tr>
          </tbody>
        </table>
        {false && (
          <div className="w-full">
            <p className="text-center w-full ">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Logs;
