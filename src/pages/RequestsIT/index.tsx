import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

import { Departments, Order } from "@/utils/types";
import Pagination from "@/components/Pagination";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, handleStatus, requestRows } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import ITFilter from "./filter";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№", key: "" },
  { name: "num", key: "id" },
  { name: "employee", key: "type" },
  { name: "executor", key: "fillial.name" },
  { name: "branch", key: "fillial.name" },
  { name: "category", key: "fillial.name" },
  { name: "comment", key: "fillial.name" },
  { name: "rate", key: "rate" },
  {
    name: "status",
    key: "status",
  },
  { name: "date", key: "category.name" },
];

const RequestsIT = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const [sort, $sort] = useState<Order[]>();
  const currentPage = Number(useQueryString("page")) || 1;
  const { sphere } = useParams();

  const user = useQueryString("user");
  const id = Number(useQueryString("id"));
  const responsible = useQueryString("responsible");
  const category_id = Number(useQueryString("category_id"));
  const urgent = useQueryString("urgent");
  const created_at = useQueryString("created_at");
  const request_status = useQueryString("request_status");
  const rate = useQueryString("rate");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  const {
    data: requests,
    isLoading: orderLoading,
    isFetching: orderFetching,
  } = useOrders({
    department: Departments.it,
    sphere_status: Number(sphere),
    page: currentPage,
    ...(!!id && { id }),
    ...(!!category_id && { category_id }),
    ...(!!created_at && {
      created_at: dayjs(created_at).format("YYYY-MM-DD"),
    }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!request_status && { request_status }),
    ...(!!user && { user }),
    ...(!!responsible && { responsible }),
    ...(!!rate && { rate: !!rate }),
    ...(!!urgent?.toString() && { urgent: !!urgent }),
  });

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: t("requests_it"),
    sheet: t("requests_it"),
  });
  const downloadAsPdf = () => onDownload();

  return (
    <Card>
      <Header title={"Заявка на IT"}>
        <button
          onClick={downloadAsPdf}
          className="btn btn-primary btn-fill mr-2"
        >
          {t("export_to_excel")}
        </button>
        <button
          onClick={() => navigate("add")}
          className="btn btn-success btn-fill"
        >
          {t("add")}
        </button>
      </Header>

      <div className="table-responsive grid-view content ">
        <ItemsCount data={requests} />
        <table ref={tableRef} className="table table-hover table-bordered">
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={requests?.items}
          >
            <ITFilter />
          </TableHead>

          <tbody>
            {!!requests?.items?.length &&
              (sort?.length ? sort : requests?.items)?.map((order, idx) => (
                <tr className={requestRows(order.status)} key={idx}>
                  <td width="40">{handleIdx(idx)}</td>
                  <td width="80">
                    <Link to={`${order?.id}?dep=${Departments.it}`}>
                      {order?.id}
                    </Link>
                  </td>
                  <td>
                    <span>{order?.user?.full_name}</span>
                  </td>
                  <td>
                    {!!order?.brigada?.name
                      ? order?.brigada?.name
                      : "-----------"}
                  </td>
                  <td>{order?.fillial?.parentfillial?.name}</td>
                  <td>{order?.category?.name}</td>
                  <td>
                    <div
                      className={
                        "overflow-hidden text-ellipsis max-w-[200px] w-full"
                      }
                    >
                      {order?.description}
                    </div>
                  </td>
                  <td width={50} className="text-center">
                    {order?.comments?.[0]?.rating}
                  </td>
                  <td>
                    {handleStatus({
                      status: order?.status,
                      dep: Departments.it,
                    })}
                  </td>
                  <td>{dayjs(order?.created_at).format("DD.MM.YYYY")}</td>
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

export default RequestsIT;
