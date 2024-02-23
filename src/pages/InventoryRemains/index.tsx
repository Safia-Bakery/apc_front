import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loader";
import useToolsIerarch from "@/hooks/useToolsIerarch";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import useQueryString from "@/hooks/custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import cl from "classnames";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "@/store/reducers/sidebar";
import { MainPermissions } from "@/utils/types";
import TableViewBtn from "@/components/TableViewBtn";
import TableHead from "@/components/TableHead";
import { useMemo, useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useTranslation } from "react-i18next";
import InventoryRemainsFilter from "./filter";
import { numberWithCommas } from "@/utils/helpers";

const column = [
  { name: "№", key: "" },
  { name: "name_in_table", key: "name" },
  { name: "price", key: "price", center: true },
  { name: "num", key: "num", center: true },
  { name: "remains", key: "amount_left", center: true },
  { name: "min", key: "min_amount", center: true },
  { name: "max", key: "max_amount", center: true },
  { name: "deadline_in_hours", key: "ftime", center: true },
  { name: "status", key: "status", center: true },
  { name: "", key: "view" },
];

const InventoryRemains = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const navigateParams = useNavigateParams();
  const permission = useAppSelector(permissionSelector);
  const handleNavigate = (route: string) => () => navigate(route);
  const mins = useQueryString("mins");
  const name = useQueryString("name");

  const parent_id = useQueryString("parent_id");
  const parent_name = useQueryString("parent_name");
  const { data, isLoading, isFetching } = useToolsIerarch({
    ...(!!parent_id && { parent_id }),
    ...(!!name && { name }),
  });

  const goBack = () => navigate(-1);

  const handleParentId = (id: string, name: string) => () =>
    navigateParams({ parent_id: id, parent_name: name });

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: t("remains_in_stock"),
    sheet: t("remains_in_stock"),
  });

  const downloadAsPdf = () => onDownload();

  const renderFilter = useMemo(() => {
    return <InventoryRemainsFilter />;
  }, []);

  const renderItems = useMemo(() => {
    if (!!parent_id)
      return (
        <table className="table table-bordered" ref={tableRef}>
          <TableHead column={column}>{renderFilter}</TableHead>
          <tbody>
            {data?.tools?.map((tool, idx) => (
              <tr
                key={idx}
                className={cl("transition-colors", {
                  ["table-danger"]:
                    tool.min_amount && tool.amount_left < tool.min_amount,
                  ["table-success"]:
                    tool.min_amount && tool.amount_left > tool.min_amount,
                })}
              >
                <td width="40">{idx + 1}</td>
                <td>{tool?.name}</td>
                <td width={150} className="text-center">
                  {numberWithCommas(tool?.price)}
                </td>
                <td width={150} className="text-center">
                  {tool?.num}
                </td>
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
                    <TableViewBtn
                      onClick={handleNavigate(`/inventory-remains/${tool.id}`)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
  }, [data?.tools]);

  const handleMins = () => navigate("/inventory-remains?mins=1");

  return (
    <Card className="pb-4">
      <Header title={!parent_name ? "Инвентарь / Товары" : parent_name}>
        <div className="flex gap-2">
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

      <ul>
        {data?.folders?.map((folder) => (
          <li
            className={cl(styles.folder, "bg-gray-300")}
            onClick={handleParentId(folder.id, folder.name)}
            key={folder.id}
          >
            <img src="/assets/icons/folder.svg" alt="folder" />
            <span>{folder.name}</span>
          </li>
        ))}
        <hr />
        {renderItems}
      </ul>

      {!data?.tools?.length && <EmptyList />}
      {(isLoading || isFetching) && <Loading absolute />}
    </Card>
  );
};

export default InventoryRemains;
