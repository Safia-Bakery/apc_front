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
import { InventoryTools, MainPermissions } from "@/utils/types";
import TableViewBtn from "@/components/TableViewBtn";
import { useMemo, useRef } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useTranslation } from "react-i18next";
import InventoryRemainsFilter from "./filter";
import { numberWithCommas } from "@/utils/helpers";
import VirtualTable from "@/components/VirtualTable";
import { ColumnDef } from "@tanstack/table-core";

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
  const columns = useMemo<ColumnDef<InventoryTools>[]>(
    () => [
      {
        accessorFn: (_, idx) => idx + 1,
        cell: (props) => <div className="w-4">{props.row.index + 1}</div>,
        header: "№",
        size: 10,
      },
      {
        accessorKey: "name",
        header: t("name_in_table"),
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "price",
        header: t("price"),
        cell: ({ row }) => numberWithCommas(row.original?.price),
      },
      {
        accessorKey: "num",
        header: t("num"),
      },
      {
        accessorKey: "amount_left",
        header: t("remains"),
      },
      {
        accessorKey: "min_amount",
        header: t("min"),
      },
      {
        accessorKey: "max_amount",
        header: t("max"),
      },
      {
        accessorKey: "ftime",
        header: t("deadline_in_hours"),
      },
      {
        accessorKey: "status",
        header: t("status"),
        cell: ({ row }) =>
          !row.original.status ? t("not_active") : t("active"),
      },
      {
        accessorKey: "action",
        size: 30,
        header: "",
        cell: ({ row }) => {
          return (
            permission?.[MainPermissions.edit_product_inventory] && (
              <TableViewBtn
                onClick={handleNavigate(
                  `/inventory-remains/${row.original.id}`
                )}
              />
            )
          );
        },
      },
    ],
    []
  );

  const renderFilter = useMemo(() => {
    return <InventoryRemainsFilter />;
  }, []);

  const renderItems = useMemo(() => {
    if (!!parent_id)
      return (
        <VirtualTable
          columns={columns}
          data={data?.tools}
          rowClassName={({ original: tool }) =>
            cl({
              ["table-danger"]:
                tool.min_amount &&
                tool.amount_left &&
                tool.amount_left < tool.min_amount,
              ["table-success"]:
                tool.min_amount && tool.amount_left > tool.min_amount,
            })
          }
        >
          {renderFilter}
        </VirtualTable>
      );
  }, [data?.tools]);

  const handleMins = () => navigate("/inventory-remains?mins=1");

  if (isFetching || isLoading) return <Loading />;

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
      {(isLoading || isFetching) && <Loading />}
    </Card>
  );
};

export default InventoryRemains;
