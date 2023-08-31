import { Link, useNavigate } from "react-router-dom";
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

const RequestsApc = () => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<keyof Order>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const permission = useAppSelector(permissionSelector);
  const sphere_status = useQueryString("sphere_status");

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
    data: requests,
    refetch,
    isLoading: orderLoading,
  } = useOrders({
    enabled: true,
    size: itemsPerPage,
    department: Departments.apc,
    page: currentPage,
    sphere_status: Number(sphere_status),
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

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleIdx = (index: number) => {
    if (currentPage === 1) return index + 1;
    else return index + 1 + itemsPerPage * (currentPage - 1);
  };

  useEffect(() => {
    refetch();
  }, [currentPage, sphere_status]);

  if (orderLoading) return <Loading />;

  return (
    <Card>
      <Header title={"Заявки"}>
        <button className="btn btn-primary btn-fill mr-2">Экспорт</button>
        {permission?.[MainPermissions.add_request_apc] && (
          <button
            onClick={() => navigate(`add?sphere_status=${sphere_status}`)}
            className="btn btn-success btn-fill"
          >
            Добавить
          </button>
        )}
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
            <RequestsFilter currentPage={currentPage} />
          </TableHead>

          {!!requests?.items?.length && (
            <tbody>
              {(sortData()?.length ? sortData() : requests?.items)?.map(
                (order, idx) => (
                  <tr className={requestRows(order?.status)} key={idx}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td width="80">
                      {permission?.[MainPermissions.add_request_apc] ? (
                        <Link
                          to={`/requests-apc/${order?.id}?sphere_status=${sphere_status}`}
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
            </tbody>
          )}
        </table>
        {!!requests && (
          <Pagination
            totalItems={requests?.total}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
        {!requests?.items?.length && (
          <div className="w-100">
            <p className="text-center w-100">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RequestsApc;
