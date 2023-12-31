import { Link, useLocation, useNavigate } from "react-router-dom";
import { Departments, MainPermissions, Order } from "@/utils/types";
import Pagination from "@/components/Pagination";
import { useEffect, useState } from "react";
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
import MarketingFilter from "./filter";
import ItemsCount from "@/components/ItemsCount";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import TableLoading from "@/components/TableLoading";
import EmptyList from "@/components/EmptyList";

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
  const [sort, $sort] = useState<Order[]>();
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

  const {
    data: requests,
    isLoading: orderLoading,
    refetch,
  } = useOrders({
    size: itemsPerPage,
    department: Departments.marketing,
    page: currentPage,
    sub_id: sub_id,

    ...(!!created_at && {
      created_at: dayjs(created_at).format("YYYY-MM-DD"),
    }),
    ...(!!id && { id }),
    ...(!!phone && { executor: phone }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!category_id && { category_id }),
    ...(!!request_status && { request_status }),
    ...(!!user && { user }),
  });

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
            onSort={(data) => $sort(data)}
            data={requests?.items}
          >
            <MarketingFilter sub_id={sub_id} />
          </TableHead>

          <tbody>
            {!!requests?.items?.length &&
              !orderLoading &&
              (sort?.length ? sort : requests?.items)?.map((order, idx) => (
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
                      <span className={"text-link"}>{order?.id}</span>
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
                  <td>{dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")}</td>
                  <td>
                    {handleStatus({
                      status: order?.status,
                      dep: Departments.marketing,
                    })}
                  </td>
                  <td>
                    {order?.user_manager ? order?.user_manager : "Не задано"}
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

export default RequestsMarketing;
