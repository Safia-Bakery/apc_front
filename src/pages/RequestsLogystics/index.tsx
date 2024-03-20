import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Departments,
  MainPermissions,
  Order,
  RequestStatus,
  ValueLabel,
} from "@/utils/types";
import Pagination from "@/components/Pagination";
import { FC, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, handleStatus, requestRows } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import ItemsCount from "@/components/ItemsCount";
import cl from "classnames";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import LogFilter from "./filter";
import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { dateTimeFormat, yearMonthDate } from "@/utils/keys";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";

interface Props {
  add: MainPermissions;
  edit: MainPermissions;
}

const column = [
  { name: "№", key: "" },
  { name: "request_number", key: "id" },
  { name: "type", key: "type" },
  { name: "client", key: "user" },
  { name: "branch_dep", key: "name" },
  { name: "group_problem", key: "category?.name" },
  { name: "urgent", key: "urgent" },
  { name: "receipt_date", key: "created_at" },
  { name: "status", key: "status" },
  { name: "changed", key: "user_manager" },
];

const reqStatus = [
  { value: RequestStatus.new },
  { value: RequestStatus.confirmed },
  { value: RequestStatus.sendToRepair },
];

const RequestsLogystics: FC<Props> = ({ add, edit }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sort, $sort] = useState<Order[]>();
  const navigateParams = useNavigateParams();
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
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: t("requests_for_logystics"),
    sheet: t("requests_for_logystics"),
  });

  const downloadAsPdf = () => onDownload();

  const {
    data: requests,
    isLoading: orderLoading,
    isFetching,
  } = useOrders({
    enabled: true,
    department: Departments.logystics,
    page: currentPage,
    ...(!!system && { is_bot: !!system }),
    ...(!!created_at && {
      created_at: dayjs(created_at).format(yearMonthDate),
    }),
    ...(!!id && { id }),
    ...(!!department && { department }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!category_id && { category_id }),
    ...(!!request_status && { request_status }),
    ...(!!user && { user }),
    ...(!!urgent && { urgent: !!urgent }),
  });

  return (
    <Card>
      <Header title="requests_for_logystics">
        <button
          onClick={downloadAsPdf}
          className="btn btn-primary btn-fill mr-2"
        >
          {t("export_to_excel")}
        </button>
        {permission?.[add] && (
          <button
            onClick={() => navigate("add")}
            className="btn btn-success btn-fill"
            id="add_request"
          >
            {t("add")}
          </button>
        )}
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={requests} />
        <table className="table table-hover" ref={tableRef}>
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={requests?.items}
          >
            <LogFilter />
          </TableHead>
          {orderLoading ? (
            <Loading />
          ) : (
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
                        <img
                          src="/assets/icons/marker.svg"
                          alt="from-location"
                        />
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
                    <td>
                      {!order?.category?.urgent
                        ? t("not_urgent")
                        : t("urgentt")}
                    </td>
                    <td>{dayjs(order?.created_at).format(dateTimeFormat)}</td>
                    <td>
                      {t(
                        handleStatus({
                          status: order?.status,
                          dep: Departments.logystics,
                        })
                      )}
                    </td>
                    <td>
                      {!!order?.user_manager
                        ? order?.user_manager
                        : t("not_given")}
                    </td>
                  </tr>
                ))}
            </tbody>
          )}
        </table>
        {isFetching && <Loading />}
        {!requests?.items?.length && !orderLoading && <EmptyList />}
        {!!requests && <Pagination totalPages={requests.pages} />}
      </div>
    </Card>
  );
};

export default RequestsLogystics;
