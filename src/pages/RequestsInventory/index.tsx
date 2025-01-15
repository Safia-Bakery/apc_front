import { Link, useParams } from "react-router-dom";
import { RequestStatus } from "@/utils/types";
import { useMemo } from "react";
import dayjs from "dayjs";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, isMobile, requestRows } from "@/utils/helpers";
import InventoryFilter from "./filter";
import useQueryString from "custom/useQueryString";
import { useTranslation } from "react-i18next";
import { dateTimeFormat, yearMonthDate } from "@/utils/keys";
import { getInventoryRequests } from "@/hooks/inventory";
import AntdTable from "@/components/AntdTable";
import Table, { ColumnsType } from "antd/es/table";

const RequestsInventory = () => {
  const { t } = useTranslation();
  const { dep } = useParams();
  const currentPage = Number(useQueryString("page")) || 1;
  const request_status = useQueryString("request_status");
  const created_at = useQueryString("created_at");
  const user = useQueryString("user");
  const product = useQueryString("product");
  const id = Number(useQueryString("id"));
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  const {
    data: requests,
    isLoading: orderLoading,
    isFetching: orderFetching,
    refetch,
    isRefetching,
  } = getInventoryRequests({
    enabled: true,
    page: currentPage,
    department: Number(dep),
    ...(!!request_status && { request_status }),
    ...(!!created_at && {
      created_at: dayjs(created_at).format(yearMonthDate),
    }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!user && { user }),
    ...(!!product && { product }),
    ...(!!id && { id }),
  });

  const columns = useMemo<ColumnsType<InventoryReqsRes>>(
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
        width: 100,
        render: (_, order) => <Link to={`${order?.id}`}>{order?.id}</Link>,
      },
      {
        title: t("sender"),
        ...(isMobile && { width: 160 }),
        dataIndex: "user?.full_name",
        render: (_, order) => order?.user?.full_name,
      },
      {
        title: t("receiver"),
        ...(isMobile && { width: 160 }),
        dataIndex: "brigada",

        render: (_, order) => order?.fillial?.parentfillial?.name,
      },
      {
        title: t("products"),
        ...(isMobile && { width: 160 }),
        dataIndex: "fillial",
        render: (_, order) => (
          <ul className="max-w-xs w-full pl-3">
            {!!order?.expanditure?.length &&
              order?.expanditure?.map((prod) => (
                <li className="list-disc" key={prod.id}>
                  {prod?.tool?.name}
                </li>
              ))}
          </ul>
        ),
      },
      {
        title: t("date"),
        dataIndex: "created_at",
        ...(isMobile && { width: 160 }),
        render: (_, record) => dayjs(record?.created_at).format(dateTimeFormat),
      },

      {
        title: t("status"),
        dataIndex: "status",
        ...(isMobile && { width: 150 }),
        render: (_, record) => t(RequestStatus[record.status]),
      },
      {
        title: t("author"),
        dataIndex: "update_time",
        ...(isMobile && { width: 100 }),
        render: (_, order) => order?.user_manager || t("not_given"),
      },
    ],
    [requests?.items]
  );

  const renderFilter = useMemo(() => {
    return <InventoryFilter />;
  }, []);

  return (
    <Card>
      <Header title={t("requests_for_inventory")}>
        <button className="btn btn-primary" onClick={() => refetch()}>
          {t("refresh")}
        </button>
      </Header>

      <div className="table-responsive content">
        <AntdTable
          sticky
          data={requests?.items}
          totalItems={requests?.total}
          columns={columns}
          loading={orderLoading || orderFetching || isRefetching}
          rowClassName={(item) => requestRows[item.status]}
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

export default RequestsInventory;
