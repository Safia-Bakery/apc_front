import { Link, useLocation, useNavigate } from "react-router-dom";
import { Departments, MainPermissions, Order, Sphere } from "@/utils/types";
import Pagination from "@/components/Pagination";
import { FC, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, handleStatus, requestRows } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import RequestsFilter from "./filter";
import ItemsCount from "@/components/ItemsCount";
import cl from "classnames";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import TableLoading from "@/components/TableLoading";
import EmptyList from "@/components/EmptyList";

interface Props {
  add: MainPermissions;
  edit: MainPermissions;
}

const RequestsApc: FC<Props> = ({ add, edit }) => {
  const navigate = useNavigate();
  const [sort, $sort] = useState<Order[]>();
  const permission = useAppSelector(permissionSelector);
  const sphere_status = useQueryString("sphere_status");
  const addExp = Number(useQueryString("addExp")) as MainPermissions;
  const currentPage = Number(useQueryString("page")) || 1;
  const { pathname, search } = useLocation();

  const user = useQueryString("user");
  const id = Number(useQueryString("id"));
  const system = useQueryString("system");
  const category_id = Number(useQueryString("category_id"));
  const urgent = useQueryString("urgent");
  const created_at = useQueryString("created_at");
  const request_status = useQueryString("request_status");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  const column = useMemo(() => {
    const columns = [
      { name: "№", key: "" },
      { name: "Номер заявки", key: "id" },
      { name: "Клиент", key: "user" },
      { name: "Филиал/Отдел", key: "name" },
      { name: "Группа проблем", key: "category?.name" },
      { name: "Срочно", key: "urgent" },
      { name: "Бригада", key: "brigada" },
      { name: "Дата поступления", key: "created_at" },
      { name: "Статус", key: "status" },
      { name: "Изменил", key: "user_manager" },
    ];

    if (Number(sphere_status) === Sphere.fabric) {
      columns.splice(2, 0, { name: "Система", key: "is_bot" });
    }

    return columns;
  }, [sphere_status]);

  const {
    data: requests,
    isLoading: orderLoading,
    refetch,
  } = useOrders({
    department: Departments.apc,
    page: currentPage,
    sphere_status: Number(sphere_status),
    ...(!!system && { is_bot: !!system }),
    ...(!!category_id && { category_id }),
    ...(!!created_at && {
      created_at: dayjs(created_at).format("YYYY-MM-DD"),
    }),
    ...(!!id && { id }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!request_status && { request_status }),
    ...(!!user && { user }),
    ...(!!urgent?.toString() && { urgent: !!urgent }),
  });

  return (
    <Card>
      <Header title={"Заявки"}>
        <button className="btn btn-primary btn-fill mr-2">Экспорт</button>
        {permission?.[add] && (
          <button
            onClick={() =>
              navigate(`add?sphere_status=${sphere_status}&addExp=${addExp}`)
            }
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
            <RequestsFilter />
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
                        to={`/requests-apc/${order?.id}?sphere_status=${sphere_status}&addExp=${addExp}`}
                        state={{ prevPath: pathname + search }}
                      >
                        {order?.id}
                      </Link>
                    ) : (
                      <span className={"text-link"}>{order?.id}</span>
                    )}
                  </td>
                  {Number(sphere_status) === Sphere.fabric && (
                    <td>{order?.is_bot ? "Телеграм-бот" : "Веб-сайт"}</td>
                  )}
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
                  <td>
                    {!!order?.brigada?.name
                      ? order?.brigada?.name
                      : "Не задано"}
                  </td>
                  <td>{dayjs(order?.created_at).format("DD.MM.YYYY")}</td>
                  <td>
                    {handleStatus({
                      status: order?.status,
                      dep: Departments.apc,
                    })}
                  </td>
                  <td>
                    {!!order?.user_manager ? order?.user_manager : "Не задано"}
                  </td>
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

export default RequestsApc;
