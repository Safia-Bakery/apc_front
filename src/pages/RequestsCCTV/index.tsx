import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import { Departments, Order } from "@/utils/types";
import Pagination from "@/components/Pagination";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, handleStatus, requestRows } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import CCTVFilter from "./filter";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";
import { useDownloadExcel } from "react-export-table-to-excel";

const column = [
  { name: "№", key: "" },
  { name: "Номер", key: "id" },
  { name: "Клиент", key: "fillial.name" },
  { name: "Филиал", key: "fillial.name" },
  { name: "Категория", key: "category" },
  { name: "Рейтинг", key: "rate" },
  { name: "Статус", key: "status" },
  { name: "Дата", key: "date" },
  { name: "Автор", key: "user_manager" },
];

const RequestsCCTV = () => {
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const [sort, $sort] = useState<Order[]>();
  const page = Number(useQueryString("page")) || 1;

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
    refetch,
  } = useOrders({
    department: Departments.cctv,
    page,
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
    filename: "Заявки на Видеонаблюдение",
    sheet: "Заявки на Видеонаблюдение",
  });
  const downloadAsPdf = () => onDownload();

  const renderFilter = useMemo(() => {
    return <CCTVFilter />;
  }, []);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Card>
      <Header title={"Заявки на Видеонаблюдение"}>
        <button
          onClick={downloadAsPdf}
          className="btn btn-primary btn-fill mr-2"
        >
          Экспорт в Excel
        </button>
        <button
          onClick={() => navigate("add")}
          className="btn btn-success btn-fill"
        >
          Добавить
        </button>
      </Header>

      <div className="table-responsive grid-view content ">
        <ItemsCount data={requests} />
        <table ref={tableRef} className="table table-hover">
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
                    <Link to={`${order?.id}?dep=${Departments.cctv}`}>
                      {order?.id}
                    </Link>
                  </td>
                  <td>
                    <span>{order?.user?.full_name}</span>
                  </td>
                  <td>{order?.fillial?.parentfillial?.name}</td>
                  <td>{order?.category?.name}</td>
                  <td>{order?.comments?.[0]?.rating}</td>
                  <td>
                    {handleStatus({
                      status: order?.status,
                    })}
                  </td>
                  <td>{dayjs(order?.created_at).format("DD.MM.YYYY")}</td>
                  <td>
                    {!!order?.user_manager ? order?.user_manager : "Не задано"}
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

export default RequestsCCTV;