import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";

import { Order } from "src/utils/types";
import Loading from "src/components/Loader";
import Pagination from "src/components/Pagination";
import { useState } from "react";
import dayjs from "dayjs";
import useOrders from "src/hooks/useOrders";
import { itemsPerPage } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import TableViewBtn from "src/components/TableViewBtn";

const column = [
  { name: "#", key: "id" as keyof Order["id"] },
  { name: "ФИО", key: "purchaser" as keyof Order["purchaser"] },
  { name: "Логин", key: "type" as keyof Order["product"] },
  { name: "Роль", key: "category.name" as keyof Order["category"] },
  { name: "Телефон", key: "price" as keyof Order["price"] },
  {
    name: "Статус",
    key: "status" as keyof Order["status"],
  },
  { name: "Последний визит", key: "status" as keyof Order["status"] },
  { name: "", key: "" },
];

const Users = () => {
  const navigate = useNavigate();
  const handleNavigate = (route: string) => () => navigate(route);

  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: orders,
    refetch,
    isLoading: orderLoading,
  } = useOrders({ size: itemsPerPage, page: currentPage });

  const [sortKey, setSortKey] = useState<keyof Order>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: any) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortData = () => {
    if (orders?.items && sortKey) {
      const sortedData = [...orders?.items].sort((a, b) => {
        if (a[sortKey]! < b[sortKey]!) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey]! > b[sortKey]!) return sortOrder === "asc" ? 1 : -1;
        else return 0;
      });
      return sortedData;
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  if (orderLoading) return <Loading />;

  return (
    <Card>
      <Header title={"Users"}>
        <button
          className="btn btn-success btn-fill"
          onClick={handleNavigate("/add-user")}
        >
          Добавить
        </button>
      </Header>

      <div className="table-responsive grid-view content">
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
              {(sortData()?.length ? sortData() : orders?.items)?.map(
                (order, idx) => (
                  <tr className="bg-blue" key={idx}>
                    <td width="40">1</td>
                    <td width={250}>
                      <a href={`/orders/${order.id}`}>Admin</a>
                    </td>
                    <td>Admin_login</td>
                    <td>
                      <span className="not-set">Role</span>
                    </td>
                    <td>phone number</td>
                    <td>status</td>
                    <td className="text-center" width={140}>
                      {dayjs(order.time_created).format("DD-MMM-YYYY HH:mm")}
                    </td>
                    <TableViewBtn onClick={handleNavigate(`/edit-user/${1}`)} />
                  </tr>
                )
              )}
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
    </Card>
  );
};

export default Users;
