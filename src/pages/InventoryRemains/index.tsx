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
import inventoryMinsMutation from "@/hooks/mutation/inventoryMins";
import { errorToast, successToast } from "@/utils/toast";
import Loading from "@/components/Loader";

const column = [
  { name: "№", key: "" },
  { name: "Наименование", key: "name" },
  { name: "Остаток", key: "amount_left", center: true },
  { name: "Минимум", key: "min_amount", center: true },
  { name: "Максимум", key: "max_amount", center: true },
  { name: "", key: "view" },
];

const InventoryRemains = () => {
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

  const { mutate: minsMutation } = inventoryMinsMutation();

  const {
    data: tools,
    isLoading: toolsLoading,
    refetch,
  } = useTools({
    department: Departments.inventory,
    page,
    few_amounts: !!mins,
    ...(!!name && { name }),
  });

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Остатки на складах",
    sheet: "Остатки на складах",
  });

  const downloadAsPdf = () => onDownload();

  const handleRequestsMins = () =>
    minsMutation(undefined, {
      onSuccess: () => {
        navigate("/order-products-inventory");
        successToast("created");
      },
      onError: (e: any) => errorToast(e.message),
    });

  const handleMins = () => {
    if (!mins) navigateParams({ mins: 1 });
    else removeParams(["mins"]);
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Card>
      <Header title="Остатки на складах">
        {!!mins && (
          <button className="btn btn-warning mr-2" onClick={handleRequestsMins}>
            Заявка на минимумы
          </button>
        )}
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
                  className={cl("transition-colors", {
                    ["table-danger"]:
                      tool.min_amount && tool.amount_left < tool.min_amount,
                    ["table-success"]:
                      tool.min_amount && tool.amount_left > tool.min_amount,
                  })}
                >
                  <td width="40">{handleIdx(idx)}</td>
                  <td>{tool?.name}</td>
                  <td width={150} className="text-center">
                    {tool?.amount_left}
                  </td>
                  <td width={150} className="text-center">
                    {tool?.min_amount}
                  </td>
                  <td width={150} className="text-center">
                    {tool?.max_amount}
                  </td>
                  <td width={40}>
                    {permission?.[MainPermissions.edit_product_inventory] && (
                      <TableViewBtn onClick={handleNavigate(`${tool.id}`)} />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {toolsLoading && <Loading absolute />}
        {!!tools && <Pagination totalPages={tools.pages} />}
        {!tools?.items?.length && !toolsLoading && <EmptyList />}
      </div>
    </Card>
  );
};

export default InventoryRemains;
