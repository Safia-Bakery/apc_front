import { useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { Departments, Order, RequestStatus } from "@/utils/types";
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
import DownloadExcell from "@/components/DownloadExcell";
import { dateTimeFormat, yearMonthDate } from "@/utils/keys";

const column = [
  { name: "№", key: "" },
  { name: "num", key: "id" },
  { name: "employee", key: "type" },
  { name: "executor", key: "fillial.name" },
  { name: "branch", key: "fillial.name" },
  { name: "category", key: "category" },
  { name: "urgent", key: "urgent" },
  { name: "reopened", key: "paused" },
  { name: "comment_table", key: "comment" },
  { name: "rate", key: "rate" },
  { name: "status", key: "status" },
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
  const responsible = Number(useQueryString("responsible"));
  const category_id = Number(useQueryString("category_id"));
  const urgent = useQueryString("urgent");
  const paused = useQueryString("paused");
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
    // sphere_status: Number(sphere),
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
    ...(!!urgent?.toString() && { urgent: !!Number(urgent) }),
    ...(!!paused?.toString() && { paused: !!Number(paused) }),
  });

  const renderFilter = useMemo(() => {
    return <ITFilter />;
  }, []);

  return (
    <Card>
      <Header title={"it_requests"}>
        <div className="flex">
          <DownloadExcell />
          <button
            onClick={() => navigate("add")}
            className="btn btn-success btn-fill"
          >
            {t("add")}
          </button>
        </div>
      </Header>

      <div className="table-responsive grid-view content ">
        <ItemsCount data={requests} />
        <table ref={tableRef} className="table table-hover table-bordered">
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={requests?.items}
          >
            {renderFilter}
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
                  <td>{!!order?.category?.urgent ? t("yes") : t("no")}</td>
                  <td>
                    {!!order?.update_time[RequestStatus.paused]
                      ? t("yes")
                      : t("no")}
                  </td>
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
                  <td>{t(handleStatus({ status: order?.status }))}</td>
                  <td>{dayjs(order?.created_at).format(dateTimeFormat)}</td>
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
