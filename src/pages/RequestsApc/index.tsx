import { Link, useLocation, useNavigate } from "react-router-dom";
import { Departments, MainPermissions, Order, Sphere } from "@/utils/types";
import Pagination from "@/components/Pagination";
import { FC, useEffect, useMemo, useRef, useState } from "react";
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
import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useTranslation } from "react-i18next";

interface Props {
  add: MainPermissions;
  edit: MainPermissions;
  sphere_status: Sphere;
  addExp: MainPermissions;
}

const RequestsApc: FC<Props> = ({ add, edit, sphere_status, addExp }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sort, $sort] = useState<Order[]>();
  const permission = useAppSelector(permissionSelector);
  const currentPage = Number(useQueryString("page")) || 1;
  const { pathname, search } = useLocation();
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: t("requests_apc_retail"),
    sheet: t("requests_apc_retail"),
  });

  const user = useQueryString("user");
  const id = Number(useQueryString("id"));
  const system = useQueryString("system");
  const category_id = Number(useQueryString("category_id"));
  const created_at = useQueryString("created_at");
  const request_status = useQueryString("request_status");
  const rate = useQueryString("rate");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const responsible = Number(useQueryString("responsible"));

  const column = useMemo(() => {
    const columns = [
      { name: "№", key: "" },
      { name: "request_number", key: "id" },
      { name: "client", key: "user" },
      { name: "branch_dep", key: "name" },
      { name: "group_problem", key: "category?.name" },
      { name: "urgent", key: "urgent" },
      { name: "brigade", key: "brigada" },
      { name: "receipt_date", key: "created_at" },
      { name: "rate", key: "rate" },
      { name: "status", key: "status" },
      { name: "changed", key: "user_manager" },
    ];

    if (Number(sphere_status) === Sphere.fabric) {
      columns.splice(2, 0, { name: "Система", key: "is_bot" });
    }

    return columns;
  }, [sphere_status]);

  const downloadAsPdf = () => onDownload();

  const {
    data: requests,
    isLoading: orderLoading,
    isFetching: orderFetching,
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
    ...(!!rate && { rate: !!rate }),
    ...(!!responsible && { brigada_id: responsible }),
  });

  const renderFilter = useMemo(() => {
    return <RequestsFilter sphere_status={sphere_status} />;
  }, [sphere_status]);

  return (
    <Card>
      <Header title={t("requests")}>
        <button
          className="btn btn-primary btn-fill mr-2"
          onClick={downloadAsPdf}
        >
          {t("export_to_excel")}
        </button>
        {permission?.[add] && (
          <button
            onClick={() =>
              navigate(`add?sphere_status=${sphere_status}&addExp=${addExp}`)
            }
            className="btn btn-success btn-fill"
          >
            {t("add")}
          </button>
        )}
      </Header>

      <div className="table-responsive grid-view content">
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
                <tr className={requestRows(order?.status)} key={idx}>
                  <td width="40">{handleIdx(idx)}</td>
                  <td width="80">
                    {permission?.[edit] ? (
                      <Link
                        to={`/requests-apc-${Sphere[sphere_status]}/${order?.id}?sphere_status=${sphere_status}&dep=${Departments.apc}`}
                        state={{ prevPath: pathname + search }}
                      >
                        {order?.id}
                      </Link>
                    ) : (
                      <span className={"text-link"}>{order?.id}</span>
                    )}
                  </td>
                  {Number(sphere_status) === Sphere.fabric && (
                    <td>{order?.is_bot ? t("tg_bot") : t("web_site")}</td>
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
                  <td>
                    {!order?.category?.urgent ? t("not_urgent") : t("urgentt")}
                  </td>
                  <td>
                    {!!order?.brigada?.name
                      ? order?.brigada?.name
                      : t("not_given")}
                  </td>
                  <td>{dayjs(order?.created_at).format("DD.MM.YYYY")}</td>
                  <td className="text-center" width={50}>
                    {order?.comments?.[0]?.rating}
                  </td>
                  <td>
                    {t(
                      handleStatus({
                        status: order?.status,
                        dep: Departments.apc,
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
        </table>
        {(orderLoading || orderFetching) && <Loading absolute />}
        {!requests?.items?.length && !orderLoading && <EmptyList />}
        {!!requests && <Pagination totalPages={requests.pages} />}
      </div>
    </Card>
  );
};

export default RequestsApc;
