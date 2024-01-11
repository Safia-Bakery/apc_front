import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import { Departments, Order } from "@/utils/types";
import Pagination from "@/components/Pagination";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, handleStatus, requestRows } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import ITFilter from "./filter";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import TableLoading from "@/components/TableLoading";
import EmptyList from "@/components/EmptyList";

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
  const { sphere } = useParams();

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
    sphere_status: Number(sphere),
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

          <tbody>
            {!!requests?.items?.length &&
              (sort?.length ? sort : requests?.items)?.map((order, idx) => (
                <tr className={requestRows(order.status)} key={idx}>
                  <td width="40">{handleIdx(idx)}</td>
                  <td width="80">
                    <Link to={`${order?.id}?dep=${Departments.it}`}>
                      {order?.id}
                    </Link>
                  </td>
                  <td>
                    <span>{order?.user?.full_name}</span>
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
            {orderLoading && <TableLoading />}
          </tbody>
        </table>
        {!!requests && <Pagination totalPages={requests.pages} />}
        {!requests?.items?.length && !orderLoading && <EmptyList />}
      </div>
    </Card>
  );
};

export default RequestsIT;
