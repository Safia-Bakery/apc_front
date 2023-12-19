import { Link, useNavigate } from "react-router-dom";
import { Departments, Order } from "src/utils/types";
import Pagination from "src/components/Pagination";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import useOrders from "src/hooks/useOrders";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { handleIdx, handleStatus, requestRows } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import ITFilter from "./filter";
import ItemsCount from "src/components/ItemsCount";
import useQueryString from "src/hooks/custom/useQueryString";
import TableLoading from "src/components/TableLoading";

const column = [
  { name: "№", key: "" },
  { name: "Номер", key: "id" },
  { name: "Сотрудник", key: "type" },
  { name: "Исполнитель", key: "fillial.name" },
  { name: "Филиал", key: "fillial.name" },
  { name: "Категория", key: "fillial.name" },
  { name: "Комментарий", key: "fillial.name" },
  {
    name: "Статус",
    key: "status",
  },
  { name: "Дата", key: "category.name" },
];

const RequestsIT = () => {
  const navigate = useNavigate();
  const [sort, $sort] = useState<Order[]>();
  const currentPage = Number(useQueryString("page")) || 1;

  const user = useQueryString("user");
  const id = Number(useQueryString("id"));
  const responsible = useQueryString("responsible");
  const category_id = Number(useQueryString("category_id"));
  const urgent = useQueryString("urgent");
  const created_at = useQueryString("created_at");
  const request_status = useQueryString("request_status");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  const {
    data: requests,
    isLoading: orderLoading,
    refetch,
  } = useOrders({
    department: Departments.it,
    page: currentPage,
    ...(!!id && { id }),
    ...(!!category_id && { category_id }),
    ...(!!created_at && {
      created_at: dayjs(created_at).format("YYYY-MM-DD"),
    }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!request_status && { request_status }),
    ...(!!user && { user }),
    ...(!!responsible && { responsible }),
    ...(!!urgent?.toString() && { urgent: !!urgent }),
  });

  useEffect(() => {
    refetch();
  }, [currentPage]);

  return (
    <Card>
      <Header title={"Заявка на IT"}>
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
            <ITFilter />
          </TableHead>

          {!!requests?.items?.length && (
            <tbody>
              {(sort?.length ? sort : requests?.items)?.map((order, idx) => (
                <tr className={requestRows(order.status)} key={idx}>
                  <td width="40">{handleIdx(idx)}</td>
                  <td width="80">
                    <Link to={`${order?.id}`}>{order?.id}</Link>
                  </td>
                  <td>
                    <span className="not-set">{order?.user?.full_name}</span>
                  </td>
                  <td>-------------</td>
                  <td>{order?.fillial?.parentfillial?.name}</td>
                  <td>{order?.category?.name}</td>
                  <td>
                    <div className={"overflow-ellipsis max-w-[200px] w-full"}>
                      {order?.description}
                    </div>
                  </td>
                  <td>
                    {handleStatus({
                      status: order?.status,
                      dep: Departments.it,
                    })}
                  </td>
                  <td>{dayjs(order?.created_at).format("DD.MM.YYYY")}</td>
                </tr>
              ))}
            </tbody>
          )}
          {orderLoading && <TableLoading />}
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

export default RequestsIT;
