import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { RequestStatus } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, isMobile, requestRows } from "@/utils/helpers";
import FactoryFilter from "./filter";
import useQueryString from "custom/useQueryString";
import AntdTable from "@/components/AntdTable";
import DownloadExcell from "@/components/DownloadExcell";
import { dateTimeFormat } from "@/utils/keys";
import Table from "antd/es/table/Table";
import { ColumnsType } from "antd/es/table";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";

import { getApcFactoryRequests } from "@/hooks/factory";
import { FactoryRequestRes } from "@/Types/factory";

const FactoryRequests = () => {
  const { t } = useTranslation();
  const currentPage = Number(useQueryString("page")) || 1;
  const { search } = useLocation();

  const user_id = Number(useQueryString("user_id"));
  const id = Number(useQueryString("id"));
  const status = useQueryString("status");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const permission = useAppSelector(permissionSelector);

  const columns = useMemo<ColumnsType<FactoryRequestRes>>(
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
          permission?.[MainPermissions.edit_fabric_requests] ? (
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
        title: t("department"),
        ...(isMobile && { width: 160 }),
        dataIndex: "fillial",
        render: (_, record) => record?.division?.name,
      },
      {
        title: t("category"),
        ...(isMobile && { width: 160 }),
        dataIndex: "category",
        render: (_, record) => record?.category?.name,
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
  } = getApcFactoryRequests({
    page: currentPage,
    ...(!!id && { id }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!user_id && { user_id }),
    ...(!!status && { status }),
  });

  const renderFilter = useMemo(() => {
    return <FactoryFilter />;
  }, []);

  return (
    <Card>
      <Header title={"apc_fabric"}>
        <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-0">
          <DownloadExcell />
        </div>
      </Header>

      <div className="overflow-x-auto md:overflow-visible content">
        <AntdTable
          sticky
          data={requests?.items}
          totalItems={requests?.total}
          columns={columns}
          loading={orderLoading || orderFetching}
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

export default FactoryRequests;
