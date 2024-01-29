import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { InventoryOrders } from "@/utils/types";
import Pagination from "@/components/Pagination";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, handleStatus, requestRows } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import cl from "classnames";
import { useDownloadExcel } from "react-export-table-to-excel";
import useInventoryOrders from "@/hooks/useInventoryOrders";
import dayjs from "dayjs";
import Loading from "@/components/Loader";

const column = [
  { name: "№", key: "" },
  { name: "Номер", key: "id" },
  { name: "Автор", key: "user" },
  { name: "Статус", key: "status" },
  { name: "Дата", key: "created_at" },
];

const InventoryOrderedTools = () => {
  const tableRef = useRef(null);
  const [sort, $sort] = useState<InventoryOrders["items"]>();
  const page = Number(useQueryString("page")) || 1;

  const {
    data: orders,
    isLoading: toolsLoading,
    refetch,
  } = useInventoryOrders({ page });

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Заявки на закуп",
    sheet: "Заявки на закуп",
  });

  const downloadAsPdf = () => onDownload();

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Card>
      <Header title="Заявки на закуп">
        <button className="btn btn-success mr-2" onClick={downloadAsPdf}>
          Export Excel
        </button>
      </Header>

      <div className="content">
        <ItemsCount data={orders} />
        <table className="table table-hover" ref={tableRef}>
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={orders?.items}
          />
          <tbody>
            {!!orders?.items?.length &&
              (sort?.length ? sort : orders?.items)?.map((order, idx) => (
                <tr
                  key={idx}
                  className={cl(
                    "transition-colors hover:bg-hoverGray",
                    requestRows(order?.status)
                  )}
                >
                  <td width="40">{handleIdx(idx)}</td>
                  <td width={50} className="text-center">
                    <Link to={`/order-products-inventory/${order.id}`}>
                      {order?.id}
                    </Link>
                  </td>
                  <td>{order?.user?.full_name}</td>
                  <td>
                    {!!order.status.toString() &&
                      handleStatus({ status: order?.status })}
                  </td>
                  <td>{dayjs(order?.created_at).format("DD.MM.YYYY")}</td>
                </tr>
              ))}
          </tbody>
        </table>
        {toolsLoading && <Loading absolute />}
        {!orders?.items?.length && !toolsLoading && <EmptyList />}
        {!!orders && <Pagination totalPages={orders.pages} />}
      </div>
    </Card>
  );
};

export default InventoryOrderedTools;
