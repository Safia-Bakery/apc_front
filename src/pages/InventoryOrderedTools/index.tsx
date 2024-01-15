import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Departments,
  InventoryOrders,
  MainPermissions,
  ToolTypes,
} from "@/utils/types";
import Pagination from "@/components/Pagination";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import TableLoading from "@/components/TableLoading";
import EmptyList from "@/components/EmptyList";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import TableViewBtn from "@/components/TableViewBtn";
import useTools from "@/hooks/useTools";
import cl from "classnames";
import {
  useNavigateParams,
  useRemoveParams,
} from "@/hooks/custom/useCustomNavigate";
import { useDownloadExcel } from "react-export-table-to-excel";
import useInventoryOrders from "@/hooks/useInventoryOrders";
import dayjs from "dayjs";

const column = [
  { name: "№", key: "" },
  { name: "Номер", key: "id" },
  { name: "Автор", key: "user" },
  { name: "Дата", key: "created_at" },
];

const InventoryOrderedTools = () => {
  const navigate = useNavigate();
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

  // const handleMins = () => {
  //   if (!mins) navigateParams({ mins: 1 });
  //   else removeParams(["mins"]);
  // };

  useEffect(() => {
    refetch();
  }, [page]);

  return (
    <Card>
      <Header title="Заявки на закуп">
        <button className="btn btn-success mr-2" onClick={downloadAsPdf}>
          Export Excel
        </button>
        {/* <button className="btn btn-primary" onClick={handleMins}>
          {!mins ? "Загрузить минимумы" : "Загрузить все"}
        </button> */}
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
                  className={cl("transition-colors hover:bg-hoverGray", {})}
                >
                  <td width="40">{handleIdx(idx)}</td>
                  <td width={50} className="text-center">
                    <Link to={`/order-products-inventory/${order.id}`}>
                      {order?.id}
                    </Link>
                  </td>
                  <td>{order?.user?.full_name}</td>
                  <td>{dayjs(order?.created_at).format("DD.MM.YYYY")}</td>
                </tr>
              ))}
            {toolsLoading && <TableLoading />}
          </tbody>
        </table>
        {!!orders && <Pagination totalPages={orders.pages} />}
        {!orders?.items?.length && !toolsLoading && <EmptyList />}
      </div>
    </Card>
  );
};

export default InventoryOrderedTools;
