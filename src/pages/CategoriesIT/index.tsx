import { FC, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Card from "@/components/Card";
import Header from "@/components/Header";
import { Category, Departments, Sphere } from "@/utils/types";
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
import CategoriesITFilter from "./filter";
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
  { name: "Время исполнении", key: "ftime" },
  { name: "status", key: "status" },
  { name: "", key: "" },
];

const CategoriesIT: FC<Props> = ({ dep, add, edit }) => {
  const { t } = useTranslation();
  const { sphere } = useParams();
  const navigate = useNavigate();
  const [sort, $sort] = useState<Category[]>();
  const permission = useAppSelector(permissionSelector);
  const currentPage = Number(useQueryString("page")) || 1;

  const { data: categories, isLoading } = useCategories({
    page: currentPage,
    ...(dep && { department: +dep }),
    ...(!!sphere && { sphere_status: Number(sphere) }),
  });

  const handleNavigate = (route: string) => () => navigate(route);

  return (
    <Card>
      <Header title={"categories"}>
        {permission?.[add] && (
          <div className="flex gap-2">
            <button
              className="btn btn-success  "
              onClick={handleNavigate("add")}
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
        <div className="table-responsive ">
          <ItemsCount data={categories} />
          <table className="table table-hover">
            <TableHead
              column={column}
              onSort={(data) => $sort(data)}
              data={categories?.items}
            >
              <CategoriesITFilter />
            </TableHead>

            <tbody>
              {!!categories?.items?.length &&
                (sort?.length ? sort : categories?.items)?.map(
                  (category, idx) => (
                    <tr key={idx} className="bg-blue">
                      <td width={40}>{handleIdx(idx)}</td>
                      <td>
                        {Number(sphere) === Sphere.purchase ? (
                          <Link
                            to={`${category?.id}/products?category_name=${category.name}`}
                          >
                            {category?.name}
                          </Link>
                        ) : (
                          category?.name
                        )}
                      </td>
                      <td>{t(Departments[category?.department!])}</td>
                      <td>
                        {category.ftime} {t("hours")}
                      </td>
                      <td>
                        {category?.status ? t("active") : t("not_active")}
                      </td>
                      <td width={40}>
                        {permission?.[edit] && (
                          <TableViewBtn
                            onClick={handleNavigate(`${category.id}`)}
                          />
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

export default CategoriesIT;
