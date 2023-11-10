import { Link, useLocation, useNavigate } from "react-router-dom";
import { Departments, MainPermissions, Order, Sphere } from "src/utils/types";
import Pagination from "src/components/Pagination";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import useOrders from "src/hooks/useOrders";
import Card from "src/components/Card";
import Header from "src/components/Header";
import {
  getValue,
  handleStatus,
  itemsPerPage,
  requestRows,
} from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import ItemsCount from "src/components/ItemsCount";
import cl from "classnames";
import { useAppSelector } from "src/redux/utils/types";
import { permissionSelector } from "src/redux/reducers/auth";
import styles from "./index.module.scss";
import useQueryString from "src/hooks/useQueryString";
import TableLoading from "src/components/TableLoading";
import BotTimeModal from "src/components/BotTimeModal";
import { useNavigateParams } from "src/hooks/useCustomNavigate";

const column = [
  { name: "№", key: "" },
  { name: "Номер заявки", key: "id" },
  { name: "Клиент", key: "user" },
  { name: "Филиал", key: "name" },
  { name: "Порция еды", key: "category?.name" },
  { name: "Порции хлеба", key: "urgent" },
  { name: "Дата поставки", key: "brigada" },
  { name: "Статус", key: "status" },
];

const RequestsStaff = () => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<keyof Order>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const permission = useAppSelector(permissionSelector);
  const sphere_status = useQueryString("sphere_status");
  const currentPage = Number(useQueryString("page")) || 1;
  const { pathname, search } = useLocation();
  const navigateParams = useNavigateParams();

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
    department: Departments.staff,
    page: currentPage,

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

  const renderProductCount = useMemo(() => {
    return requests?.items.reduce((acc, item) => acc + Number(item.product), 0);
  }, [requests]);

  const renderBreadCount = useMemo(() => {
    return requests?.items.reduce(
      (acc, item) => acc + Number(item.bread_size),
      0
    );
  }, [requests]);

  return (
    <Card>
      <Header title={"Заявки"}>
        <div className="d-flex gap-2">
          <div className="p-2 btn btn-warning">
            <div>Количество еды</div>
            <div className={styles.count}>{renderProductCount}</div>
          </div>
          <div className="p-2 btn btn-primary">
            <div>Количество хлеба</div>
            <div className={styles.count}>{renderBreadCount}</div>
          </div>
          <div className="d-flex flex-column gap-2 justify-content-between">
            {permission?.[MainPermissions.staff_modal_time] && (
              <button
                onClick={() => navigateParams({ time_modal: 1 })}
                className="btn btn-primary btn-fill"
              >
                Настройки бота
              </button>
            )}
            {permission?.[MainPermissions.add_staff_requests] && (
              <button
                onClick={() => navigate("add")}
                className="btn btn-success btn-fill"
                id="add_request"
              >
                Добавить
              </button>
            )}
          </div>
        </div>
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
            {/* <RequestsFilter /> */}
          </TableHead>
          <tbody id="requests_body">
            {!!requests?.items?.length &&
              !orderLoading &&
              (sortData()?.length ? sortData() : requests?.items)?.map(
                (order, idx) => (
                  <tr className={requestRows(order?.status)} key={idx}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td width="80">
                      {permission?.[MainPermissions.edit_staff_requests] ? (
                        <Link
                          id="request_id"
                          to={`/requests-staff/${order?.id}`}
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
                    <td>
                      {handleStatus({
                        status: order?.status,
                        dep: Departments.apc,
                      })}
                    </td>
                    <td>
                      {!!order?.user_manager
                        ? order?.user_manager
                        : "Не задано"}
                    </td>
                  </tr>
                )
              )}
            {orderLoading && <TableLoading />}
          </tbody>
        </table>
        {!!requests && <Pagination totalPages={requests.pages} />}
        {!requests?.items?.length && !orderLoading && (
          <div className="w-100">
            <p className="text-center w-100">Спосок пуст</p>
          </div>
        )}
      </div>
      <BotTimeModal />
    </Card>
  );
};

export default RequestsStaff;
