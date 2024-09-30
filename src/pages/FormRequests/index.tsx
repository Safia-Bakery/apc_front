import { Link, useNavigate } from "react-router-dom";
import {
  Departments,
  MainPermissions,
  Order,
  RequestStatus,
} from "@/utils/types";
import Loading from "@/components/Loader";
import Pagination from "@/components/Pagination";
import { useState } from "react";
import dayjs from "dayjs";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, numberWithCommas, requestRows } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import FormFilter from "./filter";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import { useTranslation } from "react-i18next";
import { dateTimeFormat, yearMonthDate } from "@/utils/keys";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "@/store/reducers/sidebar";
import DownloadFormExcel from "@/components/DownloadFormExcel";

const column = [
  { name: "№", key: "" },
  { name: "num", key: "id" },
  { name: "branch", key: "id" },
  { name: "receipt_date", key: "type" },
  { name: "form", key: "fillial.name" },
  { name: "total_sum", key: "expenditures" },
  { name: "employee", key: "created_at" },

  {
    name: "status",
    key: "status",
  },
];

const FormRequests = () => {
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
  const permissions = useAppSelector(permissionSelector);

  const {
    data: requests,
    isLoading: orderLoading,
    isFetching: orderFetching,
  } = useOrders({
    enabled: true,
    page: currentPage,
    department: Departments.form,
    ...(!!request_status && { request_status }),
    ...(!!created_at && {
      created_at: dayjs(created_at).format(yearMonthDate),
    }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!user && { user }),
    ...(!!id && { id }),
  });

  return (
    <Card>
      <Header title={t("requests_for_form")}>
        <div className="flex">
          <DownloadFormExcel />
          {permissions?.[MainPermissions.add_form_request] && (
            <button onClick={() => navigate("add")} className="btn btn-success">
              {t("add")}
            </button>
          )}
        </div>
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={requests} />
        <table className="table table-hover">
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={requests?.items}
          >
            <FormFilter />
          </TableHead>

          {!!requests?.items?.length && (
            <tbody>
              {(sort?.length ? sort : requests?.items)?.map((order, idx) => (
                <tr className={requestRows[order.status]} key={idx}>
                  <td width="40">{handleIdx(idx)}</td>
                  <td width="80">
                    {permissions?.[MainPermissions.edit_form_request] ? (
                      <Link to={`/requests-form/${order?.id}`}>
                        {order?.id}
                      </Link>
                    ) : (
                      order?.id
                    )}
                  </td>
                  <td>{order?.fillial?.parentfillial?.name}</td>
                  <td>{dayjs(order?.created_at).format(dateTimeFormat)}</td>
                  <td>
                    <ul className="max-w-xs w-full">
                      {!!order?.request_orpr &&
                        order?.request_orpr?.map((item) => (
                          <li className="list-disc" key={item.id}>
                            {item?.orpr_product?.prod_cat?.name} x{item?.amount}
                          </li>
                        ))}
                    </ul>
                  </td>
                  <td>{numberWithCommas(order?.price || 0)}</td>
                  <td>{order?.description}</td>
                  <td width={150}>{t(RequestStatus[order.status])}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {(orderFetching || orderLoading) && <Loading />}
        {!requests?.items?.length && !orderLoading && <EmptyList />}
        {!!requests && <Pagination totalPages={requests.pages} />}
      </div>
    </Card>
  );
};

export default FormRequests;
