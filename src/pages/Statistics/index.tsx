import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";
import MainDatePicker from "src/components/BaseInputs/MainDatePicker";
import ApcStatBar from "src/components/ApcStatBar";
import { useNavigateParams } from "src/hooks/useCustomNavigate";
import dayjs from "dayjs";
import useQueryString from "src/hooks/useQueryString";

const Statistics = () => {
  const navigate = useNavigate();
  const start = useQueryString("start");
  const end = useQueryString("end");
  const goBack = () => navigate(-1);
  const navigateParams = useNavigateParams();
  const handleDateStart = (event: Date) => {
    navigateParams({ start: dayjs(event).format("YYYY-MM-DD") });
  };
  const handleDateEnd = (event: Date) => {
    navigateParams({ end: dayjs(event).format("YYYY-MM-DD") });
  };

  return (
    <Card>
      <Header title={"Статистика"}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <div className="content">
        <div className={styles.dateBlock}>
          <MainDatePicker
            selected={
              !!start
                ? dayjs(start || undefined).toDate()
                : dayjs().startOf("month").toDate()
            }
            onChange={handleDateStart}
          />
          <MainDatePicker
            selected={dayjs(end || undefined).toDate()}
            onChange={handleDateEnd}
          />
          {/* <button type="submit" className={`btn btn-primary my-2`}>
            Создать
          </button> */}
        </div>

        <div className="table-responsive grid-view">
          <ApcStatBar />
        </div>
      </div>
    </Card>
  );
};

export default Statistics;
