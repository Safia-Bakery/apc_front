import { Link, useLocation, useNavigate } from "react-router-dom";
import { Departments, MainPermissions, Order } from "@/utils/types";
import Pagination from "@/components/Pagination";
import { FC, useState } from "react";
import dayjs from "dayjs";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import Header from "@/components/Header";
import {
  handleIdx,
  handleStatus,
  itemsPerPage,
  requestRows,
} from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import ItemsCount from "@/components/ItemsCount";
import cl from "classnames";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import LogFilter from "./filter";
import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";

interface Props {
  add: MainPermissions;
  edit: MainPermissions;
}

const column = [
  { name: "№", key: "" },
  { name: "Номер заявки", key: "id" },
  { name: "Тип", key: "type" },
  { name: "Клиент", key: "user" },
  { name: "Филиал/Отдел", key: "name" },
  { name: "Группа проблем", key: "category?.name" },
  { name: "Срочно", key: "urgent" },
  { name: "Дата поступления", key: "created_at" },
  { name: "Статус", key: "status" },
  { name: "Изменил", key: "user_manager" },
];

const RequestsLogystics: FC<Props> = ({ add, edit }) => {
  const navigate = useNavigate();
  const [sort, $sort] = useState<Order[]>();
  const permission = useAppSelector(permissionSelector);

  const currentPage = Number(useQueryString("page")) || 1;
  const { pathname, search } = useLocation();

  const user = useQueryString("user");
  const id = Number(useQueryString("id"));
  const system = useQueryString("system");
  const department = useQueryString("department");
  const category_id = Number(useQueryString("category_id"));
  const urgent = useQueryString("urgent");
  const created_at = useQueryString("created_at");
  const request_status = useQueryString("request_status");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  const {
    data: requests,
    isLoading: orderLoading,
    isFetching,
    refetch,
  } = useOrders({
    enabled: true,
    size: itemsPerPage,
    department: Departments.logystics,
    page: currentPage,
    ...(!!system && { is_bot: !!system }),
    ...(!!created_at && {
      created_at: dayjs(created_at).format("YYYY-MM-DD"),
    }),
    ...(!!id && { id }),
    ...(!!department && { department }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!category_id && { category_id }),
    ...(!!request_status && { request_status }),
    ...(!!user && { user: user }),
    ...(!!urgent && { urgent: !!urgent }),
  });

  if (orderLoading) return <Loading absolute />;

  return (
    <Card>
      <Header title="Заявки на Запрос машин">
        <button className="btn btn-primary btn-fill mr-2">Экспорт</button>
        {permission?.[add] && (
          <button
            onClick={() => navigate("add")}
            className="btn btn-success btn-fill"
            id="add_request"
          >
            Добавить
          </button>
        )}
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={requests} />
        <table className="table table-hover">
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={requests?.items}
          >
            <LogFilter />
          </TableHead>
          <tbody id="requests_body">
            {!!requests?.items?.length &&
              !orderLoading &&
              (sort?.length ? sort : requests?.items)?.map((order, idx) => (
                <tr className={requestRows(order?.status)} key={idx}>
                  <td width="40">{handleIdx(idx)}</td>
                  <td width="80">
                    {permission?.[edit] ? (
                      <Link
                        id="request_id"
                        to={`/requests-logystics/${order?.id}`}
                        state={{ prevPath: pathname + search }}
                      >
                        {order?.id}
                      </Link>
                    ) : (
                      <span className={"text-link"}>{order?.id}</span>
                    )}
                  </td>

                  <td width={40}>
                    {order?.fillial?.id ? (
                      <img src="/assets/icons/home.svg" alt="from-fillial" />
                    ) : (
                      <img src="/assets/icons/marker.svg" alt="from-location" />
                    )}
                  </td>

                  <td>{order?.user?.full_name}</td>
                  <td>
                    <span className={"not-set"}>
                      {order?.fillial?.parentfillial?.name}
                    </span>
                  </td>
                  <td
                    className={cl({
                      ["font-bold"]: order?.category?.urgent,
                    })}
                  >
                    {order?.category?.name}
                  </td>
                  <td>{!order?.category?.urgent ? "Несрочный" : "Срочный"}</td>
                  <td>{dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")}</td>
                  <td>
                    {handleStatus({
                      status: order?.status,
                      dep: Departments.logystics,
                    })}
                  </td>
                  <td>
                    {!!order?.user_manager ? order?.user_manager : "Не задано"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {isFetching && <Loading absolute />}
        {!requests?.items?.length && !orderLoading && <EmptyList />}
        {!!requests && <Pagination totalPages={requests.pages} />}
      </div>
    </Card>
  );
};

export default RequestsLogystics;
