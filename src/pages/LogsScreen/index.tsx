import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./index.module.scss";
import useOrder from "src/hooks/useOrder";
import dayjs from "dayjs";

const column = [
  { name: "#" },
  { name: "Действие" },
  { name: "Курер" },
  { name: "Дата" },
  { name: "Минут" },
];

const Logs = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleNavigate = () => navigate(-1);

  const { data: order } = useOrder({ id: Number(id), enabled: false });
  return (
    <Card>
      <Header title={"Logs"}>
        <button className="btn btn-success btn-fill" onClick={handleNavigate}>
          Добавить
        </button>
      </Header>

      <div className="table-responsive grid-view content">
        <table className="table table-hover">
          <thead>
            <tr>
              {column.map(({ name }) => {
                return (
                  <th className={styles.tableHead} key={name}>
                    {name}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {[...Array(4)]?.map((role, idx) => (
              <tr className="bg-blue" key={idx}>
                <td width="40">{idx + 1}</td>
                <td>action</td>
                <td>{order?.brigada?.name}</td>
                <td>{dayjs(order?.created_at).format("DD-MM-YYYY HH:mm")}</td>
                <td>datamin</td>
              </tr>
            ))}
          </tbody>
        </table>
        {false && (
          <div className="w-100">
            <p className="text-center w-100 ">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Logs;
