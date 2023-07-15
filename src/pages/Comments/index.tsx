import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { Link, useNavigate } from "react-router-dom";

import { Order } from "src/utils/types";
import Pagination from "src/components/Pagination";
import { useState } from "react";
import useOrders from "src/hooks/useOrders";
import { itemsPerPage } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import dayjs from "dayjs";

const column = [
  { name: "#", key: "id" as keyof Order["id"] },
  { name: "Сотрудник", key: "purchaser" as keyof Order["status"] },
  { name: "Заявка", key: "status" as keyof Order["status"] },
  { name: "Оценка", key: "status" as keyof Order["status"] },
  { name: "Текст", key: "status" as keyof Order["status"] },
  { name: "Дата", key: "status" as keyof Order["status"] },
];

const Comments = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const [sortKey, setSortKey] = useState<any>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: any) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const { data: orders } = useOrders({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
  });

  // const sortData = () => {
  //   if (orders?.items && sortKey) {
  //     const sortedData = [...orders?.items].sort((a, b) => {
  //       if (a[sortKey]! < b[sortKey]!) return sortOrder === "asc" ? -1 : 1;
  //       if (a[sortKey]! > b[sortKey]!) return sortOrder === "asc" ? 1 : -1;
  //       else return 0;
  //     });
  //     return sortedData;
  //   }
  // };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNavigate = (route: string) => () => navigate(route);
  return (
    <Card>
      <Header title={"Comments"}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <div className="content">
        <div className="table-responsive grid-view">
          <div className={styles.summary}>
            Показаны записи <b>1-50</b> из <b>100</b>.
          </div>
          <table className="table table-hover">
            <TableHead
              column={column}
              sort={handleSort}
              sortKey={sortKey}
              sortOrder={sortOrder}
            />

            {orders?.items.length && (
              <tbody>
                {[...Array(6)]?.map((order, idx) => (
                  <tr key={idx} className="bg-blue">
                    <td width="40">1</td>
                    <td>sotrudnit name</td>
                    <td>
                      <Link to={`/comments/${109640}`}>109640</Link>
                    </td>
                    <td>rate</td>
                    <td>text</td>
                    <td>
                      {dayjs("24.02.2023 16:33").format("DD-MM-YYYY HH:mm")}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {!!orders && (
            <Pagination
              totalItems={orders?.total}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
          {!orders?.items?.length && (
            <div className="w-100">
              <p className="text-center w-100 ">Спосок пуст</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Comments;
