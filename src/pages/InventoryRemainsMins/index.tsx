import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Departments,
  MainPermissions,
  ToolItemType,
  ToolTypes,
} from "@/utils/types";
import Pagination from "@/components/Pagination";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { numberWithCommas } from "@/utils/helpers";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import TableViewBtn from "@/components/TableViewBtn";
import useTools from "@/hooks/useTools";
import { useDownloadExcel } from "react-export-table-to-excel";
import inventoryMinsMutation from "@/hooks/mutation/inventoryMins";
import { errorToast, successToast } from "@/utils/toast";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { ColumnDef } from "@tanstack/table-core";
import VirtualTable from "@/components/VirtualTable";

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

  const columns = useMemo<ColumnDef<ToolItemType>[]>(
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
              <TableViewBtn onClick={handleNavigate(`${row.original.id}`)} />
            )
          );
        },
      },
    ],
    []
  );

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
      onError: (e) => errorToast(e.message),
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
        <VirtualTable
          columns={columns}
          data={tools?.items}
          rowClassName={(_) => "table-danger"}
        />

        {toolsLoading && <Loading />}
        {!tools?.items?.length && !toolsLoading && <EmptyList />}
        {!!tools && <Pagination totalPages={tools.pages} />}
      </div>
    </Card>
  );
};

export default InventoryRemainsMins;
