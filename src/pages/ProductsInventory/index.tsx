import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Departments, MainPermissions, ToolTypes } from "@/utils/types";
import Pagination from "@/components/Pagination";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import InventoryFilter from "./filter";
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

const column = [
  { name: "№", key: "" },
  { name: "Наименование", key: "name" },
  { name: "Остаток", key: "amount_left" },
  { name: "Минимум", key: "min_amount" },
  { name: "Максимум", key: "max_amount" },
  { name: "", key: "" },
];

const ProductsInventory = () => {
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const navigateParams = useNavigateParams();
  const removeParams = useRemoveParams();
  const [sort, $sort] = useState<ToolTypes["items"]>();
  const page = Number(useQueryString("page")) || 1;
  const name = useQueryString("name");
  const permission = useAppSelector(permissionSelector);
  const handleNavigate = (route: string) => () => navigate(route);
  const mins = useQueryString("mins");

  const {
    data: tools,
    isLoading: toolsLoading,
    refetch,
  } = useTools({
    department: Departments.inventory,
    page,
    ...(!!name && { name }),
    few_amounts: !!mins,
  });

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Продукты Инвентарь",
    sheet: "Продукты Инвентарь",
  });

  const downloadAsPdf = () => onDownload();

  const handleMins = () => {
    if (!mins) navigateParams({ mins: 1 });
    else removeParams(["mins"]);
  };

  useEffect(() => {
    refetch();
  }, [page]);

  return (
    <Card>
      <Header title="Продукты Инвентарь">
        <button className="btn btn-success mr-2" onClick={downloadAsPdf}>
          Export Excel
        </button>
        <button className="btn btn-primary" onClick={handleMins}>
          {!mins ? "Загрузить минимумы" : "Загрузить все"}
        </button>
      </Header>

      <div className="content">
        <ItemsCount data={tools} />
        <table className="table table-hover" ref={tableRef}>
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={tools?.items}
          >
            <InventoryFilter />
          </TableHead>

          <tbody>
            {!!tools?.items?.length &&
              (sort?.length ? sort : tools?.items)?.map((tool, idx) => (
                <tr
                  key={idx}
                  className={cl("", {
                    ["bg-red-300 hover:!opacity-80"]:
                      tool.min_amount && tool.amount_left < tool.min_amount,
                  })}
                >
                  <td width="40">{handleIdx(idx)}</td>
                  <td>{tool?.name}</td>
                  <td>{tool?.amount_left}</td>
                  <td>{tool?.min_amount}</td>
                  <td>{tool?.max_amount}</td>
                  <td width={40}>
                    {permission?.[MainPermissions.edit_product_inventory] && (
                      <TableViewBtn onClick={handleNavigate(`${tool.id}`)} />
                    )}
                  </td>
                </tr>
              ))}
            {toolsLoading && <TableLoading />}
          </tbody>
        </table>
        {!!tools && <Pagination totalPages={tools.pages} />}
        {!tools?.items?.length && !toolsLoading && <EmptyList />}
      </div>
    </Card>
  );
};

export default ProductsInventory;
