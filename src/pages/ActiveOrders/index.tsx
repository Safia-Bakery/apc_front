import styles from "./index.module.scss";
import { Link, useNavigate } from "react-router-dom";
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
import { errorToast, successToast } from "src/utils/toast";

const column = [
  { name: "#", key: "" },
  { name: "Номер", key: "id" as keyof Order["id"] },
  { name: "Тип", key: "type" as keyof Order["product"] },
  { name: "Отдел", key: "fillial.name" as keyof Order["category"] },
  { name: "Группа проблем", key: "category.name" as keyof Order["category"] },
  {
    name: "Срочно",
    key: "urgent" as keyof Order["category"],
  },
  { name: "Дата выполнения", key: "finished_at" as keyof Order["finished_at"] },
  { name: "Дата", key: "created_at" as keyof Order["created_at"] },
  { name: "Статус", key: "status" as keyof Order["status"] },
  { name: "Автор", key: "brigada.name" as keyof Order["status"] },
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
  } = useOrders({ size: itemsPerPage, page: currentPage, enabled: false });

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
        <button
          onClick={() => navigate("add")}
          className="btn btn-success btn-fill"
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
                    <td width="40">{handleIdx(idx)}</td>
                    <td width="80">
                      <Link to={`/orders/${order?.id}`}>{order?.id}</Link>
                    </td>
                    <td>APC</td>
                    <td>
                      <span className="not-set">{order?.fillial?.name}</span>
                    </td>
                    <td>{order?.category?.name}</td>
                    <td>{!order?.urgent ? "Несрочный" : "Срочный"}</td>
                    <td>
                      {dayjs(order?.finished_at).format("DD-MMM-YYYY HH:mm")}
                    </td>
                    <td>
                      {dayjs(order?.created_at).format("DD-MMM-YYYY HH:mm")}
                    </td>
                    <td>{order?.status}</td>
                    <td>{order?.brigada?.name}</td>
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
