import { Link, useNavigate } from "react-router-dom";
import { Departments, Order } from "src/utils/types";
import Loading from "src/components/Loader";
import Pagination from "src/components/Pagination";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import useOrders from "src/hooks/useOrders";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { handleStatus, itemsPerPage, requestRows } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import InventoryFilter from "./filter";
import ItemsCount from "src/components/ItemsCount";
import useQueryString from "src/hooks/useQueryString";

const column = [
  { name: "#", key: "" },
  { name: "Номер", key: "id" },
  { name: "ОТПРАВИТЕЛЬ", key: "type" },
  { name: "ПОЛУЧАТЕЛЬ", key: "fillial.name" },
  { name: "Дата", key: "category.name" },
  {
    name: "Статус",
    key: "status",
  },
  { name: "Автор", key: "user.name" },
];

const RequestInventory = () => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<keyof Order>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const currentPage = Number(useQueryString("page")) || 1;

  const handleSort = (key: any) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const {
    data: requests,
    refetch,
    isLoading: orderLoading,
  } = useOrders({
    enabled: true,
    size: itemsPerPage,
    page: currentPage,
    department: Departments.inventory,
  });

  const sortData = () => {
    if (requests?.items && sortKey) {
      const sortedData = [...requests?.items].sort((a, b) => {
        if (a[sortKey]! < b[sortKey]!) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey]! > b[sortKey]!) return sortOrder === "asc" ? 1 : -1;
        else return 0;
      });
      return sortedData;
    }
  };

  const handleIdx = (index: number) => {
    if (currentPage === 1) return index + 1;
    else return index + 1 + itemsPerPage * (currentPage - 1);
  };

  useEffect(() => {
    refetch();
  }, [currentPage]);

  if (orderLoading) return <Loading />;

  return (
    <Card>
      <Header title={"Заявка на инвентарь"}>
        {/* <button className="btn btn-primary btn-fill mr-2">Экспорт</button> */}
        <button
          onClick={() => navigate("add")}
          className="btn btn-success btn-fill"
        >
          Добавить
        </button>
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={requests} currentPage={currentPage} />
        <table className="table table-hover">
          <TableHead
            column={column}
            sort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
          >
            <InventoryFilter currentPage={currentPage} />
          </TableHead>

          {!!requests?.items?.length && (
            <tbody>
              {(sortData()?.length ? sortData() : requests?.items)?.map(
                (order, idx) => (
                  <tr className={requestRows(order.status)} key={idx}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td width="80">
                      <Link to={`/requests-inventory/${order?.id}`}>
                        {order?.id}
                      </Link>
                    </td>
                    <td>
                      <span className="not-set">{order?.user.full_name}</span>
                    </td>
                    <td>{order?.fillial?.parentfillial?.name}</td>
                    <td>
                      {dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")}
                    </td>
                    <td>{handleStatus(order?.status)}</td>
                    <td>{order?.user?.full_name}</td>
                  </tr>
                )
              )}
            </tbody>
          )}
        </table>
        {!!requests && (
          <Pagination
            totalItems={requests?.total}
            itemsPerPage={itemsPerPage}
          />
        )}
        {!requests?.items?.length && !orderLoading && (
          <div className="w-100">
            <p className="text-center w-100">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RequestInventory;
