import { useMemo } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { RequestStatus } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, isMobile, requestRows } from "@/utils/helpers";

import useQueryString from "custom/useQueryString";
import AntdTable from "@/components/AntdTable";
import { dateTimeFormat, yearMonthDate } from "@/utils/keys";
import Table from "antd/es/table/Table";
import { ColumnsType } from "antd/es/table";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";

import HrRequestFilter from "./filter";
import { getAppointments } from "@/hooks/hr-registration";

const HrRequests = () => {
  const { t } = useTranslation();
  const currentPage = Number(useQueryString("page")) || 1;

  const user_id = Number(useQueryString("user_id"));
  const id = Number(useQueryString("id"));
  const status = useQueryString("status");
  const responsible = Number(useQueryString("responsible"));
  const category_id = Number(useQueryString("category_id"));
  const created_at = useQueryString("created_at");
  const user = useQueryString("user");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const permission = useAppSelector(permissionSelector);

  const columns = useMemo<ColumnsType<HrAppointmentRes>>(
    () => [
      {
        title: "№",
        dataIndex: "",
        width: 60,
        className: "!px-0 text-center",
        render: (_, r, idx) => handleIdx(idx),
      },
      {
        title: t("num"),
        dataIndex: "id",
        width: 100,
        render: (_, order) =>
          permission?.[MainPermissions.edit_hr_requests] ? (
            <Link to={`${order?.id}`}>{order?.id}</Link>
          ) : (
            order?.id
          ),
      },
      {
        title: t("position"),
        ...(isMobile && { width: 160 }),
        dataIndex: "position",
        render: (_, record) => record?.position?.name,
      },
      {
        title: t("creator"),
        ...(isMobile && { width: 160 }),
        dataIndex: "user",
        render: (_, record) => record?.user?.full_name,
      },
      {
        title: t("employee_name"),
        ...(isMobile && { width: 160 }),
        dataIndex: "employee_name",
      },
      {
        title: t("branch"),
        ...(isMobile && { width: 160 }),
        dataIndex: "user",
        render: (_, record) => record?.branch?.name,
      },
      {
        title: t("status"),
        dataIndex: "status",
        ...(isMobile && { width: 150 }),
        render: (_, record) => t(RequestStatus[record.status]),
      },
      {
        title: t("meeting_time"),
        dataIndex: "time_slot",
        ...(isMobile && { width: 160 }),
        render: (_, record) => dayjs(record?.time_slot).format(dateTimeFormat),
      },
    ],
    []
  );

  const {
    data: requests,
    isLoading: orderLoading,
    isFetching: orderFetching,
    isRefetching,
    refetch,
  } = getAppointments({
    page: currentPage,
    ...(!!id && { id }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!user_id && { user_id }),
    ...(!!user && { user }),
    ...(!!status && { status }),
    ...(!!responsible && { responsible }),
    ...(!!category_id && { category_id }),
    ...(!!created_at && {
      created_at: dayjs(created_at).format(yearMonthDate),
    }),
  });

  const renderFilter = useMemo(() => {
    return <HrRequestFilter />;
  }, []);

  return (
    <Card>
      <Header title={"hr_registration"}>
        {/* <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-0">
          <DownloadExcell />
        </div> */}
        <button className="btn btn-primary" onClick={() => refetch()}>
          {t("refresh")}
        </button>
      </Header>

      <div className="overflow-x-auto md:overflow-visible content">
        <AntdTable
          sticky
          data={requests?.items}
          totalItems={requests?.total}
          columns={columns}
          loading={orderLoading || orderFetching || isRefetching}
          rowClassName={(item) => requestRows[item?.status]}
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

export default HrRequests;
