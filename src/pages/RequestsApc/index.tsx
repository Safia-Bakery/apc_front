import { useLocation, useNavigate } from "react-router-dom";
import { Departments, Order, RequestStatus, Sphere } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import Pagination from "@/components/Pagination";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, requestRows } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import RequestsFilter from "./filter";
import ItemsCount from "@/components/ItemsCount";
import cl from "classnames";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useTranslation } from "react-i18next";
import { dateTimeFormat, yearMonthDate } from "@/utils/keys";

interface Props {
  add: MainPermissions;
  edit: MainPermissions;
  addExp: MainPermissions;
}

const column = [
  { name: "№", key: "" },
  { name: "request_number", key: "id" },
  { name: "client", key: "user" },
  { name: "branch_dep", key: "name" },
  { name: "group_problem", key: "category?.name" },
  { name: "urgent", key: "urgent" },
  { name: "brigade", key: "brigada" },
  { name: "receipt_date", key: "created_at" },
  { name: "finished", key: "finished_at" },
  { name: "rate", key: "rate" },
  { name: "status", key: "status" },
  { name: "changed", key: "user_manager" },
];

const RequestsApc: FC<Props> = ({ add, edit, addExp }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sort, $sort] = useState<Order[]>();
  const permission = useAppSelector(permissionSelector);
  const currentPage = Number(useQueryString("page")) || 1;
  const { pathname, search, state } = useLocation();
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: t("requests_apc_retail"),
    sheet: t("requests_apc_retail"),
  });

  const user = useQueryString("user");
  const id = Number(useQueryString("id"));
  const category_id = Number(useQueryString("category_id"));
  const created_at = useQueryString("created_at");
  const started_at = useQueryString("started_at");
  const finished_at = useQueryString("finished_at");
  const request_status = useQueryString("request_status");
  const rate = useQueryString("rate");
  const service_filter = useQueryString("service_filter");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const responsible = Number(useQueryString("responsible"));

  const downloadAsPdf = () => onDownload();

  const handleServiceRow = (item: Order) => {
    if (
      dayjs(item.finished_at).diff(item.started_at, "h") < item?.category?.ftime
    )
      return "table-success";
    else if (
      dayjs(item.finished_at).diff(item.started_at, "h") >=
      item?.category?.ftime
    )
      return "table-warning";
    else return "table-danger";
  };

  const {
    data: requests,
    isLoading: orderLoading,
    isFetching: orderFetching,
  } = useOrders({
    department: Departments.APC,
    page: currentPage,
    sphere_status: Sphere.retail,
    ...(!!category_id && { category_id }),
    ...(!!created_at && {
      created_at: dayjs(created_at).format(yearMonthDate),
    }),
    ...(!!id && { id }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!request_status && { request_status }),
    ...(!!user && { user }),
    ...(!!rate && { rate: !!rate }),
    ...(!!responsible && { brigada_id: responsible }),
    ...(!!finished_at && { finished_at }),
    ...(!!started_at && { started_at }),
  });

  const handleNavigate = (url: string) => {
    navigate(url, {
      state: {
        prevPath: pathname + search,
        scrolled: window.scrollY,
      },
    });
  };

  useEffect(() => {
    if (state?.scrolled) window.scrollTo(0, state.scrolled);
  }, []);

  const renderFilter = useMemo(() => {
    return <RequestsFilter />;
  }, []);

  return (
    <Card>
      <Header title={t("requests")}>
        <button
          className="btn btn-primary btn-fill mr-2"
          onClick={downloadAsPdf}
        >
          {t("export_to_excel")}
        </button>
        {permission?.has(add) && (
          <button
            onClick={() => navigate(`add?&addExp=${addExp}`)}
            className="btn btn-success btn-fill"
          >
            {t("add")}
          </button>
        )}
      </Header>

      <div className="table-responsive content">
        <ItemsCount data={requests} />
        <table className="table table-hover table-bordered" ref={tableRef}>
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={requests?.items}
          >
            {renderFilter}
          </TableHead>
          <tbody>
            {!!requests?.items?.length &&
              !orderLoading &&
              (sort?.length ? sort : requests?.items)?.map((order, idx) => (
                <tr
                  className={
                    !service_filter
                      ? requestRows[order?.status]
                      : handleServiceRow(order)
                  }
                  key={idx}
                >
                  <td width="40">{handleIdx(idx)}</td>
                  <td width="80">
                    {permission?.has(edit) ? (
                      <span
                        className="text-blue-500 cursor-pointer"
                        // to={}
                        onClick={() =>
                          handleNavigate(
                            `/requests-apc-retail/${order?.id}?dep=${Departments.APC}`
                          )
                        }
                      >
                        {order?.id}
                      </span>
                    ) : (
                      <span className={"text-link"}>{order?.id}</span>
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
                    {!order?.category?.urgent ? t("not_urgent") : t("urgentt")}
                  </td>
                  <td>
                    {!!order?.brigada?.name
                      ? order?.brigada?.name
                      : t("not_given")}
                  </td>
                  <td>{dayjs(order?.created_at).format(dateTimeFormat)}</td>

                  <td>
                    {!!order?.finished_at
                      ? dayjs(order?.finished_at).format(dateTimeFormat)
                      : t("not_given")}
                  </td>

                  <td className="text-center" width={50}>
                    {order?.comments?.[0]?.rating}
                  </td>

                  <td>{t(RequestStatus[order.status])}</td>

                  <td>
                    {!!order?.user_manager
                      ? order?.user_manager
                      : t("not_given")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {(orderLoading || orderFetching) && <Loading />}
        {!requests?.items?.length && !orderLoading && <EmptyList />}
        {!!requests && <Pagination totalPages={requests.pages} />}
      </div>
    </Card>
  );
};

export default RequestsApc;
