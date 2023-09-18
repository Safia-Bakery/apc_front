import { Link, useLocation, useNavigate } from "react-router-dom";
import { Departments, MainPermissions, Order, Sphere } from "src/utils/types";
import Loading from "src/components/Loader";
import Pagination from "src/components/Pagination";
import { FC, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import useOrders from "src/hooks/useOrders";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { handleStatus, itemsPerPage, requestRows } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import RequestsFilter from "./filter";
import ItemsCount from "src/components/ItemsCount";
import cl from "classnames";
import { useAppSelector } from "src/redux/utils/types";
import { permissionSelector } from "src/redux/reducers/auth";
import styles from "./index.module.scss";
import useQueryString from "src/hooks/useQueryString";

interface Props {
  add: MainPermissions;
  edit: MainPermissions;
}

const RequestsApc: FC<Props> = ({ add, edit }) => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<keyof Order>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const permission = useAppSelector(permissionSelector);
  const sphere_status = useQueryString("sphere_status");
  const addExp = Number(useQueryString("addExp")) as MainPermissions;
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

  const column = useMemo(() => {
    const columns = [
      { name: "#", key: "" },
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

  const getValue = (obj: any, key: string) => {
    const keys = key.split(".");
    let value = obj;

    for (const k of keys) {
      if (!value) break;
      value = value[k];
    }

    return value;
  };

  const renderFilter = useMemo(() => {
    return <RequestsFilter />;
  }, [
    user,
    id,
    system,
    department,
    category_id,
    urgent,
    created_at,
    request_status,
    branch,
  ]);

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
    isLoading: orderLoading,
    refetch,
  } = useOrders({
    enabled: true,
    size: itemsPerPage,
    department: Departments.apc,
    page: currentPage,
    sphere_status: Number(sphere_status),

    ...(!!sphere_status && { sphere_status: Number(sphere_status) }),
    ...(!!system && { is_bot: !!system }),
    body: {
      ...(!!created_at && {
        created_at: dayjs(created_at).format("YYYY-MM-DD"),
      }),
      ...(!!id && { id }),
      ...(!!department && { department }),
      ...(!!branch?.id && { fillial_id: branch?.id }),
      ...(!!category_id && { category_id }),
      ...(!!request_status && { request_status }),
      ...(!!user && { user: user }),
      ...(!!urgent && { urgent }),
    },
  });
  const sortData = () => {
    if (requests?.items && sortKey) {
      const sortedData = [...requests.items].sort((a, b) => {
        const valueA = getValue(a, sortKey);
        const valueB = getValue(b, sortKey);

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
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
  }, [currentPage, sphere_status]);

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
            sort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
          >
            {/* <RequestsFilter currentPage={currentPage} /> */}
            {renderFilter}
          </TableHead>
          <tbody id="requests_body">
            {!!requests?.items?.length &&
              !orderLoading &&
              (sortData()?.length ? sortData() : requests?.items)?.map(
                (order, idx) => (
                  <tr className={requestRows(order?.status)} key={idx}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td width="80">
                      {permission?.[edit] ? (
                        <Link
                          id="request_id"
                          to={`${order?.id}?sphere_status=${sphere_status}&addExp=${addExp}`}
                          state={{ prevPath: pathname + search }}
                        >
                          {order?.id}
                        </Link>
                      ) : (
                        <span className={styles.link}>{order?.id}</span>
                      )}
                    </td>
                    {Number(sphere_status) === Sphere.fabric && (
                      <td>{order?.is_bot ? "Телеграм-бот" : "Веб-сайт"}</td>
                    )}
                    <td>{order?.user?.full_name}</td>
                    <td>
                      <span className={"not-set"}>
                        {order?.fillial?.parentfillial?.name}
                        {/* {order?.fillial?.name} */}
                      </span>
                    </td>
                    <td
                      className={cl({
                        ["font-weight-bold"]: order?.category?.urgent,
                      })}
                    >
                      {order?.category?.name}
                    </td>
                    <td>
                      {!order?.category?.urgent ? "Несрочный" : "Срочный"}
                    </td>
                    <td>
                      {!!order?.brigada?.name
                        ? order?.brigada?.name
                        : "Не задано"}
                    </td>
                    <td>
                      {dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")}
                    </td>
                    <td>{handleStatus(order?.status)}</td>
                    <td>
                      {!!order?.user_manager
                        ? order?.user_manager
                        : "Не задано"}
                    </td>
                  </tr>
                )
              )}
            {orderLoading && (
              <tr>
                <td>
                  <Loading />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {!!requests && <Pagination totalPages={requests.pages} />}
        {!requests?.items?.length && !orderLoading && (
          <div className="w-100">
            <p className="text-center w-100">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RequestsApc;
