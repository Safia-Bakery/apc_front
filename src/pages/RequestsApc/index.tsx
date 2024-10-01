import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Departments,
  MainPermissions,
  Order,
  RequestStatus,
  Sphere,
} from "@/utils/types";
import { FC, useMemo, useRef } from "react";
import dayjs from "dayjs";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, requestRows } from "@/utils/helpers";
import RequestsFilter from "./filter";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useTranslation } from "react-i18next";
import { dateTimeFormat, yearMonthDate } from "@/utils/keys";
import AntdTable from "@/components/AntdTable";
import Table, { ColumnsType } from "antd/es/table";

interface Props {
  add: MainPermissions;
  edit: MainPermissions;
  sphere_status: Sphere;
  addExp: MainPermissions;
}

const RequestsApc: FC<Props> = ({ add, edit, sphere_status, addExp }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
    sphere_status: Number(sphere_status),
    ...(!!system && { is_bot: !!system }),
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

  const columns = useMemo<ColumnsType<Order>>(
    () => [
      {
        title: "№",
        dataIndex: "",
        width: 50,
        className: "!px-0 text-center",
        render: (_, r, idx) => handleIdx(idx),
      },
      {
        title: t("request_number"),
        dataIndex: "id",
        render: (_, order) =>
          permission?.[edit] ? (
            <Link
              to={`/requests-apc-${Sphere[sphere_status]}/${order?.id}?sphere_status=${sphere_status}&dep=${Departments.APC}`}
              state={{ prevPath: pathname + search }}
            >
              {order?.id}
            </Link>
          ) : (
            order?.id
          ),
      },
      {
        title: t("client"),
        dataIndex: "user",
        render: (_, record) => record?.user?.full_name,
      },
      {
        title: t("branch_dep"),
        dataIndex: "fillial",
        render: (_, record) => record?.fillial?.parentfillial?.name,
      },
      {
        title: t("group_problem"),
        dataIndex: "group_problem",
        render: (_, record) => record?.category?.name,
      },
      {
        title: t("urgent"),
        dataIndex: "urgent",
        render: (_, record) =>
          !record?.urgent ? t("not_urgent") : t("urgentt"),
      },
      {
        title: t("brigade"),
        dataIndex: "brigade",
        render: (_, record) => record?.brigada?.name,
      },
      {
        title: t("receipt_date"),
        dataIndex: "created_at",
        render: (_, record) => dayjs(record?.created_at).format(dateTimeFormat),
      },
      {
        title: t("finished"),
        dataIndex: "finished_at",
        render: (_, record) =>
          dayjs(record?.finished_at).format(dateTimeFormat),
      },
      {
        title: t("rate"),
        dataIndex: "rate",
        render: (_, record) => record?.comments?.[0]?.rating,
      },
      {
        title: t("status"),
        dataIndex: "status",
        render: (_, record) => t(RequestStatus[record.status]),
      },
      {
        title: t("changed"),
        dataIndex: "user_manager",
      },
    ],
    []
  );

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
        <AntdTable
          sticky
          data={requests?.items}
          totalItems={requests?.total}
          columns={columns}
          loading={orderLoading || orderFetching}
          rowClassName={(item) =>
            !service_filter ? requestRows[item?.status] : handleServiceRow(item)
          }
          summary={() => (
            <Table.Summary fixed={"top"}>
              <Table.Summary.Row className="sticky top-0 z-10">
                {renderFilter}
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </Card>
  );
};

export default RequestsApc;
