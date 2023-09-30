import { Link, useLocation, useNavigate } from "react-router-dom";
import { Departments, MainPermissions, Order } from "src/utils/types";
import Pagination from "src/components/Pagination";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import useOrders from "src/hooks/useOrders";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { handleStatus, itemsPerPage, requestRows } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import InventoryFilter from "./filter";
import ItemsCount from "src/components/ItemsCount";
import { useAppSelector } from "src/redux/utils/types";
import { permissionSelector } from "src/redux/reducers/auth";
import styles from "./index.module.scss";
import useQueryString from "src/hooks/useQueryString";
import TableLoading from "src/components/TableLoading";

const column = [
  { name: "№", key: "" },
  { name: "Номер заявки", key: "id" },
  { name: "Имя", key: "type" },
  { name: "Номер телефона", key: "fillial.name" },
  { name: "Подкатегория", key: "fillial.name" },
  { name: "Филиал", key: "fillial.name" },
  { name: "Дата оформления", key: "fillial.name" },
  {
    name: "Статус",
    key: "status",
  },
  { name: "Изменил", key: "category.name" },
];

const RequestsMarketing = () => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<keyof Order>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const permission = useAppSelector(permissionSelector);
  const currentPage = Number(useQueryString("page")) || 1;
  const { pathname, search } = useLocation();

  const title = useQueryString("title");
  const sub_id = Number(useQueryString("sub_id"));
  const add = Number(useQueryString("add")) as MainPermissions;
  const edit = Number(useQueryString("edit")) as MainPermissions;

  const request_status = useQueryString("request_status");
  const category_id = Number(useQueryString("category_id"));
  const created_at = useQueryString("created_at");
  const id = useQueryString("id");
  const phone = useQueryString("phone");
  const user = useQueryString("user");
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
    size: itemsPerPage,
    department: Departments.marketing,
    page: currentPage,
    sub_id: sub_id,

    body: {
      ...(!!created_at && {
        created_at: dayjs(created_at).format("YYYY-MM-DD"),
      }),
      ...(!!id && { id }),
      ...(!!phone && { executor: phone }),
      ...(!!branch?.id && { fillial_id: branch?.id }),
      ...(!!category_id && { category_id }),
      ...(!!request_status && { request_status }),
      ...(!!user && { user }),
    },
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
  const renderFilter = useMemo(() => {
    return <InventoryFilter sub_id={sub_id} />;
  }, [request_status, category_id, created_at, id, phone, user, branch]);

  useEffect(() => {
    refetch();
  }, [currentPage, sub_id]);

  return (
    <Card className="overflow-hidden">
      <Header title={title?.toString()}>
        {permission?.[add] && (
          <button
            onClick={() =>
              navigate(
                `add?sub_id=${sub_id}&add=${add}&edit=${edit}&title=${title}`
              )
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
            {renderFilter}
          </TableHead>

          <tbody>
            {!!requests?.items?.length &&
              !orderLoading &&
              (sortData()?.length ? sortData() : requests?.items)?.map(
                (order, idx) => (
                  <tr className={requestRows(order.status)} key={idx}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td width="80">
                      {permission?.[edit] ? (
                        <Link
                          id="request_id"
                          to={`${order?.id}?sub_id=${sub_id}&edit=${edit}`}
                          state={{ prevPath: pathname + search }}
                        >
                          {order?.id}
                        </Link>
                      ) : (
                        <span className={styles.link}>{order?.id}</span>
                      )}
                    </td>
                    <td>
                      <span className="not-set">{order?.user?.full_name}</span>
                    </td>
                    <td>{order?.user?.phone_number}</td>
                    <td>{order?.category?.name}</td>
                    <td>{order?.fillial?.parentfillial?.name}</td>
                    {/* <td width={100} className={styles.text}>
                      {order?.description}
                    </td> */}
                    <td>
                      {dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")}
                    </td>
                    <td>{handleStatus(order?.status)}</td>
                    <td>
                      {order?.user_manager ? order?.user_manager : "Не задано"}
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
    </Card>
  );
};

export default RequestsMarketing;
