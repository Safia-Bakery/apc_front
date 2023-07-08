import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";

const column = [
  { name: "#" },
  { name: "Наименование" },
  { name: "Количество" },
  { name: "Примичание" },
  { name: "Дата" },
  {
    name: "Автор",
  },
];

const ShowRole = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <Card>
      <Header title={"ShowRole"} subTitle="subtitle">
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <div className="content">
        {[...Array(4)].map((table, index) => {
          return (
            <table
              key={index}
              className="table table-striped table-hover report-table"
            >
              <thead>
                <tr>
                  <th className={styles.tableHead}>#</th>
                  <th className={styles.tableHead}>Панель управления</th>
                  <th className={styles.tableHead}>
                    <input type="checkbox" className="select-all" value="1" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {[...Array(4)].map((item, idx) => {
                  return (
                    <tr key={idx}>
                      <td width={30}>{idx + 1}</td>
                      <td>Доступ</td>
                      <td width={50}>
                        <input
                          type="checkbox"
                          value="manageDashboard"
                          checked={true}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
        })}
      </div>
    </Card>
  );
};

export default ShowRole;
