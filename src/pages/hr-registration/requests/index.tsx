import { Table } from "antd";
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
import { dateTimeFormat } from "@/utils/keys";
import { ColumnsType } from "antd/es/table";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import { getAppointments } from "@/hooks/hr-registration";
import HrRequestFilter from "./filter";
import useUpdateQueryStr from "@/hooks/custom/useUpdateQueryStr";

export const RequestStatusHr: { [key: number]: string } = {
  // { value: RequestStatus.new, label: "Новый" },
  [RequestStatus.received]: "Принят",
  [RequestStatus.finished]: "Оформлен",
  [RequestStatus.closed_denied]: "Отменен",
  [RequestStatus.denied]: "Не оформлен",
};

const HrRequests = () => {
  const { t } = useTranslation();
  const currentPage = Number(useQueryString("page")) || 1;

  const id = useQueryString("id");
  const status = useQueryString("status");
  const employee_name = useQueryString("employee_name");
  const position_id = useQueryString("position_id");
  const user = useQueryString("user");
  const branchJson = useUpdateQueryStr("branch");
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
        render: (_, record) => RequestStatusHr[record.status],
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
    enabled: true,
    page: currentPage,
    ...(!!id && { request_id: Number(id) }),
    ...(!!branch?.id && { branch_id: branch?.id }),
    ...(!!user && { created_user: user }),
    ...(!!status && { status: Number(status) }),
    ...(!!employee_name && { employee_name }),
    ...(!!position_id && { position_id: Number(position_id) }),
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
