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
import { useEffect, useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";

const column = [
  { name: "№", key: "" },
  { name: "Наименование", key: "name" },
  { name: "Остаток", key: "amount_left", center: true },
  { name: "Минимум", key: "min_amount", center: true },
  { name: "Максимум", key: "max_amount", center: true },
  { name: "Дедлайн(в часах)", key: "ftime", center: true },
  { name: "", key: "view" },
];

const InventoryRemains = () => {
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const navigateParams = useNavigateParams();
  const permission = useAppSelector(permissionSelector);
  const handleNavigate = (route: string) => () => navigate(route);
  const mins = useQueryString("mins");

  const parent_id = useQueryString("parent_id");
  const parent_name = useQueryString("parent_name");
  const { data, isLoading, isFetching, refetch } = useToolsIerarch({
    ...(!!parent_id && { parent_id }),
  });

  const handleParentId = (id: string, name: string) => () =>
    navigateParams({ parent_id: id, parent_name: name });

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Остатки на складах",
    sheet: "Остатки на складах",
  });

  const downloadAsPdf = () => onDownload();

  const handleMins = () => navigate("/inventory-remains?mins=1");

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) return <Loading absolute />;

  return (
    <Card className="pb-4">
      <Header title={!parent_name ? "Инвентарь / Товары" : parent_name}>
        <button className="btn btn-success mr-2" onClick={downloadAsPdf}>
          Export Excel
        </button>
        <button className="btn btn-primary" onClick={handleMins}>
          {!mins ? "Загрузить минимумы" : "Загрузить все"}
        </button>
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
        {!!data?.tools?.length && (
          <table className="table table-bordered" ref={tableRef}>
            <TableHead column={column} />
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
                  <td width={40}>
                    {permission?.[MainPermissions.edit_product_inventory] && (
                      <TableViewBtn
                        onClick={handleNavigate(
                          `/inventory-remains/${tool.id}`
                        )}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ul>
      {!data?.folders.length && !data?.tools.length && <EmptyList />}
      {!isLoading && isFetching && <Loading absolute />}
    </Card>
  );
};

export default InventoryRemains;
