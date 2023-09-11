import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { Order } from "src/utils/types";
import TableHead from "src/components/TableHead";
import useOrders from "src/hooks/useOrders";
import { itemsPerPage } from "src/utils/helpers";
import Pagination from "src/components/Pagination";
import MainDatePicker from "src/components/BaseInputs/MainDatePicker";
import ItemsCount from "src/components/ItemsCount";
import Chart from "react-apexcharts";
import ApcStatBar from "src/components/ApcStatBar";
import CategoryStat from "./CategoryStat";
import FillialStat from "./FillialStat";

const Statistics = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const [selectedDate, setSelectedDate] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const { data: requests } = useOrders({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
  });

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
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
          <MainDatePicker selected={new Date()} onChange={handleDateChange} />
          <MainDatePicker selected={new Date()} onChange={handleDateChange} />
          <button type="submit" className={`btn btn-primary my-2`}>
            Создать
          </button>
        </div>

        <div className="table-responsive grid-view">
          <ItemsCount data={requests} currentPage={currentPage} />
          <ApcStatBar />
          {/* <Routes>
            <Route path="/" element={<ApcStatBar />}>
              <Route index element={<CategoryStat />} />
              <Route path="fillial" element={<FillialStat />} />
            </Route>
          </Routes> */}
        </div>
      </div>
    </Card>
  );
};

export default Statistics;
