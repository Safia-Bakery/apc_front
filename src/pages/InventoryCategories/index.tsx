import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { Category } from "@/utils/types";
import TableViewBtn from "@/components/TableViewBtn";
import useCategories from "@/hooks/useCategories";
import useQueryString from "custom/useQueryString";
import { useTranslation } from "react-i18next";
import AntdTable from "@/components/AntdTable";
import { ColumnsType } from "antd/es/table";

const InventoryCategories = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dep } = useParams();
  const { search } = useLocation();
  const page = Number(useQueryString("page")) || 1;
  const parent_name = useQueryString("parent_name");
  const { data: categories, isLoading } = useCategories({
    page,
    department: dep,
  });
  const handleNavigate = (route: string) => navigate(route);

  const handleEdit = (id: number) => {
    handleNavigate(id.toString());
  };

  const columns = useMemo<ColumnsType<Category>>(
    () => [
      {
        render: (_, r, idx) => idx + 1,
        title: "№",
        width: 100,
      },
      {
        dataIndex: "name",
        title: t("name_in_table"),
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
          return <TableViewBtn onClick={() => handleEdit(record.id)} />;
        },
      },
    ],
    []
  );

  return (
    <Card>
      <Header title={parent_name || "categories"}>
        <div className="flex gap-2">
          <button
            className="btn btn-success"
            onClick={() => handleNavigate(`add${search}`)}
            id="add_category"
          >
            {t("add")}
          </button>
          <button onClick={() => navigate(-1)} className="btn btn-primary">
            {t("back")}
          </button>
        </div>
      </Header>

      <AntdTable
        data={categories?.items}
        totalItems={categories?.total}
        columns={columns}
        loading={isLoading}
      />
    </Card>
  );
};

export default InventoryCategories;
