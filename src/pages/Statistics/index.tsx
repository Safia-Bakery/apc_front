import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";

import { ChangeEvent, useMemo, useState } from "react";
import { Order } from "src/utils/types";
import TableHead from "src/components/TableHead";
import useOrders from "src/hooks/useOrders";
import { itemsPerPage } from "src/utils/helpers";
import Pagination from "src/components/Pagination";
import MainDatePicker from "src/components/BaseInputs/MainDatePicker";
import ItemsCount from "src/components/ItemsCount";

const column = [
  { name: "#", key: "id" as keyof Order["id"] },
  { name: "Время выполнения", key: "purchaser" as keyof Order["status"] },
  { name: "Статус заявок", key: "status" as keyof Order["status"] },
  {
    name: "Время обработки по бригадам",
    key: "status" as keyof Order["status"],
  },
  { name: "По филиалам", key: "status" as keyof Order["status"] },
  { name: "По категориям", key: "status" as keyof Order["status"] },
  { name: "", key: "" },
];

const Statistics = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const [selectedDate, setSelectedDate] = useState<string>("");

  const [sortKey, setSortKey] = useState<any>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const handleNavigate = (route: string) => () => navigate(route);

  const handleSort = (key: any) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const { data: requests } = useOrders({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
  });

  const handlePageChange = (page: number) => setCurrentPage(page);
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
          <table className="table table-hover">
            <TableHead
              column={column}
              sort={handleSort}
              sortKey={sortKey}
              sortOrder={sortOrder}
            />

            {!!requests?.items.length && (
              <tbody>
                {[...Array(6)]?.map((order, idx) => (
                  <tr key={idx} className="bg-blue">
                    <td width="40">1</td>
                    <td>test name</td>
                    <td>Активный</td>
                    <td>Активный</td>
                    <td>Активный</td>
                    <td>Активный</td>
                    {/* <TableViewBtn
                      onClick={handleNavigate(`/categories/${1}`)}
                    /> */}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {!!requests && (
            <Pagination
              totalItems={requests?.total}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
          {!requests?.items?.length && (
            <div className="w-100">
              <p className="text-center w-100 ">Спосок пуст</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Statistics;
