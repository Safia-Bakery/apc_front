import { Link, useNavigate } from "react-router-dom";
import { Departments, Order } from "src/utils/types";
import Loading from "src/components/Loader";
import Pagination from "src/components/Pagination";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import useOrders from "src/hooks/useOrders";
import Card from "src/components/Card";
import Header from "src/components/Header";
import {
  handleIdx,
  handleStatus,
  itemsPerPage,
  requestRows,
} from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import InventoryFilter from "./filter";
import ItemsCount from "src/components/ItemsCount";
import useQueryString from "src/hooks/custom/useQueryString";

const column = [
  { name: "№", key: "" },
  { name: "Номер", key: "id" },
  { name: "ОТПРАВИТЕЛЬ", key: "type" },
  { name: "ПОЛУЧАТЕЛЬ", key: "fillial.name" },
  { name: "Дата", key: "created_at" },
  {
    name: "Статус",
    key: "status",
  },
  { name: "Автор", key: "user.name" },
];

const RequestInventory = () => {
  const navigate = useNavigate();
  const currentPage = Number(useQueryString("page")) || 1;
  const [sort, $sort] = useState<Order[]>();

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

  useEffect(() => {
    refetch();
  }, [currentPage]);

  if (orderLoading) return <Loading absolute />;

  return (
    <Card>
      <Header title={"Заявка на инвентарь"}>
        <button
          onClick={() => navigate("add")}
          className="btn btn-success btn-fill"
        >
          Добавить
        </button>
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={requests} />
        <table className="table table-hover">
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={requests?.items}
          >
            <InventoryFilter />
          </TableHead>

          {!!requests?.items?.length && (
            <tbody>
              {(sort?.length ? sort : requests?.items)?.map((order, idx) => (
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
                  <td>{dayjs(order?.created_at).format("DD.MM.YYYY")}</td>
                  <td>
                    {handleStatus({
                      status: order?.status,
                      dep: Departments.inventory,
                    })}
                  </td>
                  <td>{order?.user?.full_name}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {!!requests && <Pagination totalPages={requests.pages} />}
        {!requests?.items?.length && !orderLoading && (
          <div className="w-full">
            <p className="text-center w-full">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RequestInventory;
