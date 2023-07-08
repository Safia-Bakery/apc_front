import styles from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import { Status, Order } from "src/utils/types";
import Loading from "src/components/Loader";
import Pagination from "src/components/Pagination";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import useOrders from "src/hooks/useOrders";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { itemsPerPage } from "src/utils/helpers";
import TableHead from "src/components/TableHead";

const column = [
  { name: "#", key: "id" as keyof Order["id"] },
  { name: "Номер", key: "purchaser" as keyof Order["purchaser"] },
  { name: "Тип", key: "type" as keyof Order["product"] },
  { name: "Отдел", key: "category.name" as keyof Order["category"] },
  { name: "Группа проблем", key: "price" as keyof Order["price"] },
  {
    name: "Срочно",
    key: "time_created" as keyof Order["time_created"],
  },
  { name: "Дата выполнения", key: "status" as keyof Order["status"] },
  { name: "Дата", key: "status" as keyof Order["status"] },
  { name: "Статус", key: "status" as keyof Order["status"] },
  { name: "Автор", key: "status" as keyof Order["status"] },
];

const ActiveOrders = () => {
  const navigate = useNavigate();
  const [submitting, $submitting] = useState(false);

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
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: orders,
    refetch,
    isLoading: orderLoading,
  } = useOrders({ size: itemsPerPage, page: currentPage });

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

  const handleNavigate = (id: number) => () => navigate(`/order/${id}`);

  const handleStatusSubmit =
    (body: { order_id: number; status: Status }) => () => {
      $submitting(true);
      // mutate(body, {
      //   onSuccess: () => {
      //     refetch();
      //     body.status === Status.accepted
      //       ? successToast("успешно принито")
      //       : successToast("успешно отклонено");

      //     $submitting(false);
      //   },
      //   onError: (error: any) => {
      //     errorToast(error.toString());
      //     $submitting(false);
      //   },
      // });
    };

  const handleIdx = (index: number) => {
    if (currentPage === 1) return index + 1;
    else return index + 1 + itemsPerPage * (currentPage - 1);
  };

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  if (orderLoading) return <Loading />;

  return (
    <Card>
      <Header title={"Orders"}>
        <button className="btn btn-primary btn-fill">Экспорт</button>
        <button className="btn btn-success btn-fill">Добавить</button>
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
                    <td width="80">
                      <a href={`/orders/${order.id}`}>109640</a>
                    </td>
                    <td>APC</td>
                    <td>
                      <span className="not-set">(не задано)</span>
                    </td>
                    <td>Электричество</td>
                    <td>Срочный</td>
                    <td>-</td>
                    <td>
                      {dayjs(order.time_created).format("DD-MMM-YYYY HH:mm")}
                    </td>
                    <td>Назначен</td>
                    <td>Сафия Шохимардон</td>
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
            <p className="text-center w-100">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActiveOrders;
