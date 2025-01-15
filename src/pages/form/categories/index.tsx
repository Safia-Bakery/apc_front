import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { MainPermissions } from "@/utils/permissions";
import { handleIdx, numberWithCommas } from "@/utils/helpers";
import TableViewBtn from "@/components/TableViewBtn";
import useQueryString from "custom/useQueryString";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import { useTranslation } from "react-i18next";
import { getFormCategories } from "@/hooks/forms";
import { ColumnsType } from "antd/es/table";
import AntdTable from "@/components/AntdTable";

const FormCategories = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const permission = useAppSelector(permissionSelector);
  const parent_name = useQueryString("parent_name");
  const {
    data: categories,
    isLoading,
    refetch,
    isRefetching,
  } = getFormCategories({});
  const handleNavigate = (route: string) => navigate(route);

  const columns = useMemo<ColumnsType<FormCategoryRes>>(
    () => [
      {
        title: "№",
        dataIndex: "",
        width: 50,
        className: "!px-0 text-center",
        render: (_, r, idx) => handleIdx(idx),
      },
      {
        title: t("name_in_table"),
        dataIndex: "name",
      },
      {
        title: t("price"),
        dataIndex: "price",
        render: (_, record) => numberWithCommas(record?.price),
      },
      {
        title: t("status"),
        dataIndex: "status",
        render: (_, record) => (record?.status ? t("active") : t("not_active")),
      },
      {
        title: t(""),
        width: 80,
        dataIndex: "action",
        render: (_, record) =>
          permission?.has(MainPermissions.edit_form_category) && (
            <TableViewBtn
              onClick={() => handleNavigate(`/categories-form/${record?.id}`)}
            />
          ),
      },
    ],
    []
  );

  return (
    <Card>
      <Header title={parent_name || "form_type_price"}>
        {permission?.has(MainPermissions.add_form_category) && (
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={() => refetch()}>
              {t("refresh")}
            </button>
            <button
              className="btn btn-success"
              onClick={() => handleNavigate("add")}
            >
              {t("add")}
            </button>
            <button onClick={() => navigate(-1)} className="btn btn-primary">
              {t("back")}
            </button>
          </div>
        )}
      </Header>

      <div className="content">
        <AntdTable
          loading={isLoading || isRefetching}
          columns={columns}
          data={categories}
        />
      </div>
    </Card>
  );
};

export default FormCategories;
