import { FC, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { Category, Departments, MarketingSubDep, Sphere } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import Pagination from "@/components/Pagination";
import { handleIdx } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import useCategories from "@/hooks/useCategories";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";

interface Props {
  sphere_status?: number;
  dep?: Departments;
  add: MainPermissions;
  edit: MainPermissions;
}

const column = [
  { name: "№", key: "" },
  { name: "name_in_table", key: "name" },
  { name: "department", key: "department" },
  { name: "status", key: "status" },
  { name: "", key: "" },
];

const Categories: FC<Props> = ({ sphere_status, dep, add, edit }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sort, $sort] = useState<Category[]>();
  const { search } = useLocation();
  const permission = useAppSelector(permissionSelector);
  const page = Number(useQueryString("page")) || 1;
  const parent_id = Number(useQueryString("parent_id"));
  const parent_name = useQueryString("parent_name");
  const { data: categories, isLoading } = useCategories({
    page,
    ...(dep && { department: +dep }),
    ...(sphere_status && { sphere_status }),
    ...(!!parent_id && { parent_id }),
  });
  const handleNavigate = (route: string) => navigate(route);

  const handleEdit = (item: Category) => {
    handleNavigate(
      `/categories-${Departments[Number(dep)]}${
        !!sphere_status ? `-${Sphere[sphere_status]}` : ""
      }/${item.id}?dep=${item?.department}${
        !!item?.sub_id ? `&sub_id=${item.sub_id}` : ""
      }`
    );
  };

  return (
    <Card>
      <Header title={parent_name || "categories"}>
        {permission?.has(add) && (
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
        )}
      </Header>

      <div className="content">
        <div className="table-responsive ">
          <ItemsCount data={categories} />
          <table className="table table-hover">
            <TableHead
              column={column}
              onSort={(data) => $sort(data)}
              data={categories?.items}
            />

            <tbody>
              {!!categories?.items?.length &&
                (sort?.length ? sort : categories?.items)?.map(
                  (category, idx) => (
                    <tr key={idx} className="bg-blue">
                      <td width="40">{handleIdx(idx)}</td>
                      <td>
                        {!category.is_child && dep === Departments.APC ? (
                          <Link
                            to={`?parent_id=${category.id}&parent_name=${category.name}`}
                          >
                            {category?.name}
                          </Link>
                        ) : (
                          category?.name
                        )}
                      </td>
                      <td>
                        {t(
                          category?.sub_id
                            ? MarketingSubDep[category?.sub_id]
                            : Departments[category.department!]
                        )}
                      </td>
                      <td>
                        {category?.status ? t("active") : t("not_active")}
                      </td>
                      <td width={40}>
                        {permission?.has(edit) && (
                          <TableViewBtn onClick={() => handleEdit(category)} />
                        )}
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
          {isLoading && <Loading />}

          {!categories?.items?.length && !isLoading && <EmptyList />}
          {!!categories && <Pagination totalPages={categories.pages} />}
        </div>
      </div>
    </Card>
  );
};

export default Categories;
