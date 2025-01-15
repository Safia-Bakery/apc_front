import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Departments, ToolItemType } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { numberWithCommas } from "@/utils/helpers";
import useQueryString from "custom/useQueryString";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import TableViewBtn from "@/components/TableViewBtn";
import useTools from "@/hooks/useTools";
import inventoryMinsMutation from "@/hooks/mutation/inventoryMins";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import { useTranslation } from "react-i18next";
import AntdTable from "@/components/AntdTable";
import { ColumnsType } from "antd/es/table";

const InventoryRemainsMins = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const page = Number(useQueryString("page")) || 1;
  const name = useQueryString("name");
  const permission = useAppSelector(permissionSelector);
  const handleNavigate = (route: string) => () => navigate(route);
  const mins = useQueryString("mins");

  const columns = useMemo<ColumnsType<ToolItemType>>(
    () => [
      {
        render: (_, r, idx) => idx + 1,
        title: "№",
        width: 50,
      },
      {
        dataIndex: "name",
        title: t("name_in_table"),
      },
      {
        dataIndex: "price",
        title: t("price"),
        render: (_, record) => numberWithCommas(record?.price),
      },
      {
        dataIndex: "num",
        title: t("num"),
      },
      {
        dataIndex: "amount_left",
        title: t("remains"),
      },
      {
        dataIndex: "min_amount",
        title: t("min"),
      },
      {
        dataIndex: "max_amount",
        title: t("max"),
      },
      {
        dataIndex: "ftime",
        title: t("deadline_in_hours"),
      },
      {
        dataIndex: "status",
        title: t("status"),
        render: (_, record) => (!record.status ? t("not_active") : t("active")),
      },
      {
        dataIndex: "action",
        width: 50,
        title: "",
        render: (_, record) => {
          return (
            permission?.has(MainPermissions.edit_product_inventory_retail) && (
              <TableViewBtn onClick={handleNavigate(`${record.id}`)} />
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
    department: Departments.inventory_retail,
    page,
    few_amounts: !!mins,
    ...(!!name && { name }),
  });

  const goBack = () => navigate(-1);

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
          <button className="btn btn-primary" onClick={handleMins}>
            {!mins ? t("upload_mins") : t("upload_all")}
          </button>
          <button className="btn btn-primary" onClick={goBack}>
            {t("back")}
          </button>
        </div>
      </Header>

      <div className="content">
        {/* <VirtualTable
          columns={columns}
          data={tools?.items}
          rowClassName={(_) => "table-danger"}
        /> */}

        <AntdTable
          totalItems={tools?.total}
          data={tools?.items}
          virtual
          scroll={{ y: 400 }}
          columns={columns}
          loading={toolsLoading}
          rowClassName={(_) => "table-danger"}
        />
      </div>
    </Card>
  );
};

export default InventoryRemainsMins;
