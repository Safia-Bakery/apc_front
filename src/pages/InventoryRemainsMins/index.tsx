import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Departments, MainPermissions, ToolTypes } from "@/utils/types";
import Pagination from "@/components/Pagination";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import TableViewBtn from "@/components/TableViewBtn";
import useTools from "@/hooks/useTools";
import cl from "classnames";
import { useDownloadExcel } from "react-export-table-to-excel";
import inventoryMinsMutation from "@/hooks/mutation/inventoryMins";
import { errorToast, successToast } from "@/utils/toast";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№", key: "" },
  { name: "name_in_table", key: "name" },
  { name: "remains", key: "amount_left", center: true },
  { name: "min", key: "min_amount", center: true },
  { name: "max", key: "max_amount", center: true },
  { name: "deadline", key: "deadline", center: true },
  { name: "status", key: "status", center: true },
  { name: "", key: "view" },
];

const InventoryRemainsMins = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tableRef = useRef(null);
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
    filename: t("remains_in_stock"),
    sheet: t("remains_in_stock"),
  });
  const goBack = () => navigate(-1);

  const downloadAsPdf = () => onDownload();

  const handleRequestsMins = () =>
    minsMutation(undefined, {
      onSuccess: () => {
        navigate("/order-products-inventory");
        successToast("created");
      },
      onError: (e: any) => errorToast(e.message),
    });

  const handleMins = () => navigate("/products-ierarch");

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Card>
      <Header title="remains_in_stock">
        <div className="flex gap-2">
          {!!mins && (
            <button className="btn btn-warning" onClick={handleRequestsMins}>
              {t("request_for_mins")}
            </button>
          )}
          <button className="btn btn-success" onClick={downloadAsPdf}>
            {t("export_to_excel")}
          </button>
          <button className="btn btn-primary" onClick={handleMins}>
            {!mins ? t("upload_mins") : t("upload_all")}
          </button>
          <button className="btn btn-primary" onClick={goBack}>
            {t("back")}
          </button>
        </div>
      </Header>

      <div className="content">
        <ItemsCount data={tools} />
        <table className="table table-hover table-bordered" ref={tableRef}>
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={tools?.items}
          />

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
                  <td width={150} className="text-center">
                    {tool?.ftime}
                  </td>
                  <td width={150} className="text-center">
                    {!!tool?.status ? t("active") : t("not_active")}
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
        {!tools?.items?.length && !toolsLoading && <EmptyList />}
        {!!tools && <Pagination totalPages={tools.pages} />}
      </div>
    </Card>
  );
};

export default InventoryRemainsMins;
