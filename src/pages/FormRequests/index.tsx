import { Link, useNavigate } from "react-router-dom";
import { Departments, Order, RequestStatus } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import { useMemo } from "react";
import dayjs from "dayjs";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, numberWithCommas, requestRows } from "@/utils/helpers";
import FormFilter from "./filter";
import useQueryString from "custom/useQueryString";
import { useTranslation } from "react-i18next";
import { dateTimeFormat, yearMonthDate } from "@/utils/keys";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "@/store/reducers/sidebar";
import DownloadFormExcel from "@/components/DownloadFormExcel";
import AntdTable from "@/components/AntdTable";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";

const FormRequests = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentPage = Number(useQueryString("page")) || 1;
  const request_status = useQueryString("request_status");
  const created_at = useQueryString("created_at");
  const user = useQueryString("user");
  const id = Number(useQueryString("id"));
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const permissions = useAppSelector(permissionSelector);

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

        render: (_, order) =>
          permissions?.[MainPermissions.edit_form_request] ? (
            <Link to={`/requests-form/${order?.id}`}>{order?.id}</Link>
          ) : (
            order?.id
          ),
      },
      {
        title: t("branch"),
        dataIndex: "fillial",
        render: (_, record) => record?.fillial?.parentfillial?.name,
      },
      {
        title: t("receipt_date"),
        dataIndex: "created_at",

        render: (_, record) => dayjs(record?.created_at).format(dateTimeFormat),
      },
      {
        title: t("form"),
        dataIndex: "request_orpr",
        render: (_, record) => (
          <ul className="max-w-xs w-full pl-3">
            {!!record?.request_orpr &&
              record?.request_orpr?.map((item) => (
                <li className="list-disc" key={item.id}>
                  {item?.orpr_product?.prod_cat?.name} x{item?.amount}
                </li>
              ))}
          </ul>
        ),
      },
      {
        title: t("total_sum"),
        dataIndex: "price",
        render: (_, record) => numberWithCommas(record?.price || 0),
      },
      {
        title: t("employee"),
        dataIndex: "description",
      },
      {
        title: t("status"),
        dataIndex: "status",
        render: (_, record) => t(RequestStatus[record.status]),
      },
    ],
    []
  );

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

      <div className="table-responsive  content">
        <AntdTable
          sticky
          data={requests?.items}
          totalItems={requests?.total}
          columns={columns}
          loading={orderFetching || orderLoading}
          rowClassName={(item) => requestRows[item.status]}
          summary={() => (
            <Table.Summary fixed={"top"}>
              <Table.Summary.Row className="sticky top-0 z-10">
                <FormFilter />
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </Card>
  );
};

export default FormRequests;
