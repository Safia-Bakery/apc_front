import { Link, useNavigate } from "react-router-dom";
import { Departments, Order } from "@/utils/types";
import Loading from "@/components/Loader";
import Pagination from "@/components/Pagination";
import { useState } from "react";
import dayjs from "dayjs";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, handleStatus, requestRows } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import InventoryFilter from "./filter";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№", key: "" },
  { name: "num", key: "id" },
  { name: "sender", key: "type" },
  { name: "receiver", key: "fillial.name" },
  { name: "products", key: "expenditures" },
  { name: "date", key: "created_at" },

  {
    name: "status",
    key: "status",
  },
  { name: "author", key: "user.name" },
];

const RequestsInventory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentPage = Number(useQueryString("page")) || 1;
  const [sort, $sort] = useState<Order[]>();
  const request_status = useQueryString("request_status");
  const created_at = useQueryString("created_at");
  const user = useQueryString("user");
  const id = Number(useQueryString("id"));
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  const {
    data: requests,
    isLoading: orderLoading,
    isFetching: orderFetching,
  } = useOrders({
    enabled: true,
    page: currentPage,
    department: Departments.inventory,
    ...(!!request_status && { request_status }),
    ...(!!created_at && {
      created_at: dayjs(created_at).format("YYYY-MM-DD"),
    }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!user && { user }),
    ...(!!id && { id }),
  });

  return (
    <Card>
      <Header title={t("requests_for_inventory")}>
        <button
          onClick={() => navigate("add")}
          className="btn btn-success btn-fill"
        >
          {t("add")}
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
                  <td>
                    <ul className="max-w-xs w-full">
                      {!!order?.expanditure?.length &&
                        order?.expanditure?.map((prod) => (
                          <li className="list-disc" key={prod.id}>
                            {prod?.tool?.name}
                          </li>
                        ))}
                    </ul>
                  </td>
                  <td>{dayjs(order?.created_at).format("DD.MM.YYYY")}</td>
                  <td>
                    {handleStatus({
                      status: order?.status,
                      dep: Departments.inventory,
                    })}
                  </td>
                  <td>{order?.user_manager}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {(orderFetching || orderLoading) && <Loading absolute />}
        {!!requests && <Pagination totalPages={requests.pages} />}
        {!requests?.items?.length && !orderLoading && <EmptyList />}
      </div>
    </Card>
  );
};

export default RequestsInventory;
