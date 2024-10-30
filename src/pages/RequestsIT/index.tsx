import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Departments, Order, RequestStatus } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, isMobile, requestRows } from "@/utils/helpers";
import ITFilter from "./filter";
import useQueryString from "custom/useQueryString";
import AntdTable from "@/components/AntdTable";
import DownloadExcell from "@/components/DownloadExcell";
import { dateTimeFormat, yearMonthDate } from "@/utils/keys";
import Table from "antd/es/table/Table";
import { ColumnsType } from "antd/es/table";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";

const RequestsIT = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentPage = Number(useQueryString("page")) || 1;
  const { search } = useLocation();

  const user = useQueryString("user");
  const id = Number(useQueryString("id"));
  const responsible = Number(useQueryString("responsible"));
  const category_id = Number(useQueryString("category_id"));
  const urgent = useQueryString("urgent");
  const paused = useQueryString("paused");
  const created_at = useQueryString("created_at");
  const request_status = useQueryString("request_status");
  const rate = useQueryString("rate");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const started_at = useQueryString("started_at");
  const finished_at = useQueryString("finished_at");
  const service_filter = useQueryString("service_filter");
  const permission = useAppSelector(permissionSelector);

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
        title: t("num"),
        dataIndex: "id",
        width: 80,
        render: (_, order) =>
          permission?.[MainPermissions.edit_it_requests] ? (
            <Link to={`${order?.id}`} state={{ search }}>
              {order?.id}
            </Link>
          ) : (
            order?.id
          ),
      },
      {
        title: t("employee"),
        ...(isMobile && { width: 160 }),
        dataIndex: "user?.full_name",
        render: (_, record) => record?.user?.full_name,
      },
      {
        title: t("executor"),
        ...(isMobile && { width: 160 }),
        dataIndex: "brigada",

        render: (_, record) =>
          !!record?.brigada?.name ? record?.brigada?.name : "-----------",
      },
      {
        title: t("branch"),
        ...(isMobile && { width: 160 }),
        dataIndex: "fillial",
        render: (_, record) => record?.fillial?.parentfillial?.name,
      },
      {
        title: t("category"),
        ...(isMobile && { width: 160 }),
        dataIndex: "category",
        render: (_, record) => record?.category?.name,
      },
      {
        title: t("urgent"),
        dataIndex: "urgent",
        ...(isMobile && { width: 160 }),
        render: (_, record) =>
          !!record?.category?.urgent ? t("yes") : t("no"),
      },
      {
        title: t("reopened"),
        dataIndex: "update_time",
        ...(isMobile && { width: 100 }),
        render: (_, record) =>
          !!(
            record?.update_time[RequestStatus.paused] ||
            record?.update_time[RequestStatus.resumed]
          )
            ? t("yes")
            : t("no"),
      },
      {
        title: t("comment_table"),
        ...(isMobile && { width: 160 }),
        dataIndex: "description",
        render: (_, record) => record?.description,
      },
      {
        title: t("rate"),
        dataIndex: "comments",
        ...(isMobile && { width: 100 }),
        render: (_, record) => record?.comments?.[0]?.rating,
      },
      {
        title: t("status"),
        dataIndex: "status",
        ...(isMobile && { width: 150 }),
        render: (_, record) => t(RequestStatus[record.status]),
      },
      {
        title: t("date"),
        dataIndex: "created_at",
        ...(isMobile && { width: 160 }),
        render: (_, record) => dayjs(record?.created_at).format(dateTimeFormat),
      },
    ],
    [search]
  );

  const {
    data: requests,
    isLoading: orderLoading,
    isFetching: orderFetching,
  } = useOrders({
    department: Departments.IT,
    page: currentPage,
    ...(!!id && { id }),
    ...(!!category_id && { category_id }),
    ...(!!created_at && {
      created_at: dayjs(created_at).format(yearMonthDate),
    }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!request_status && { request_status }),
    ...(!!user && { user }),
    ...(!!responsible && { brigada_id: responsible }),
    ...(!!rate?.toString() && { rate: !!rate }),
    ...(!!finished_at && { finished_at }),
    ...(!!started_at && { started_at }),
    ...(!!urgent?.toString() && { urgent: !!Number(urgent) }),
    ...(!!paused?.toString() && { paused: !!Number(paused) }),
  });

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

  const renderFilter = useMemo(() => {
    return <ITFilter />;
  }, []);

  return (
    <Card>
      <Header title={"it_requests"}>
        <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-0">
          <DownloadExcell />
          <button onClick={() => navigate("add")} className="btn btn-success">
            {t("add")}
          </button>
        </div>
      </Header>

      <div className="table-responsive content">
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

export default RequestsIT;
