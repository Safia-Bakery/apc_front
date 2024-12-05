import { FC, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { Category, Departments } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import { handleIdx } from "@/utils/helpers";
import TableViewBtn from "@/components/TableViewBtn";
import useCategories from "@/hooks/useCategories";
import useQueryString from "custom/useQueryString";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import CategoriesITFilter from "./filter";
import { useTranslation } from "react-i18next";
import AntdTable from "@/components/AntdTable";
import Table, { ColumnsType } from "antd/es/table";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";

interface Props {
  sphere_status?: number;
  dep?: Departments;
  add: MainPermissions;
  edit: MainPermissions;
}
const CategoriesIT: FC<Props> = ({ dep, add, edit }) => {
  const { t } = useTranslation();
  const { sphere } = useParams();
  const navigate = useNavigate();
  const { search } = useLocation();
  const permission = useAppSelector(permissionSelector);
  const navigateParams = useNavigateParams();
  const currentPage = Number(useQueryString("page")) || 1;
  const parent_id = Number(useQueryString("parent_id"));
  const parent_name = useQueryString("parent_name");

  const { data: categories, isLoading } = useCategories({
    page: currentPage,
    ...(dep && { department: +dep }),
    ...(!!sphere && { sphere_status: Number(sphere) }),
    ...(!!parent_id && { parent_id }),
  });

  const columns = useMemo<ColumnsType<Category>>(
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
        render: (_, record) =>
          permission?.[edit] && !record.is_child ? (
            <span
              className="cursor-pointer text-blue-500"
              onClick={() =>
                navigateParams({
                  parent_id: record.id,
                  parent_name: record.name,
                })
              }
            >
              {record?.name}
            </span>
          ) : (
            record?.name
          ),
      },
      {
        title: t("execution_time_hoours"),
        dataIndex: "ftime",

        render: (_, record) => record.ftime,
      },
      {
        title: t("status"),
        dataIndex: "status",
        render: (_, record) => (record?.status ? t("active") : t("not_active")),
      },
      {
        title: "",
        dataIndex: "",
        width: 50,
        render: (_, record) =>
          permission?.[edit] && (
            <TableViewBtn onClick={handleNavigate(`${record.id}`)} />
          ),
      },
    ],
    []
  );

  const handleNavigate = (route: string) => () => navigate(route);

  return (
    <Card>
      <Header title={parent_name || "categories"}>
        {permission?.[add] && (
          <div className="flex gap-2">
            <button
              className="btn btn-success"
              onClick={handleNavigate(`add${!!search ? search : ""}`)}
              id="add_category"
            >
              {t("add")}
            </button>
            <button onClick={() => navigate(-1)} className="btn btn-primary  ">
              {t("back")}
            </button>
          </div>
        )}
      </Header>

      <div className="content">
        <div className="">
          <AntdTable
            sticky
            columns={columns}
            totalItems={categories?.total}
            data={categories?.items}
            loading={isLoading}
            summary={() => (
              <Table.Summary fixed={"top"}>
                <Table.Summary.Row className="sticky top-0 z-10">
                  <CategoriesITFilter />
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />
        </div>
      </div>
    </Card>
  );
};

export default CategoriesIT;
