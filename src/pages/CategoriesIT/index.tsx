import { FC, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Card from "@/components/Card";
import Header from "@/components/Header";
import { Category, Departments, MainPermissions, Sphere } from "@/utils/types";
import Pagination from "@/components/Pagination";
import { handleDepartment, handleIdx, itemsPerPage } from "@/utils/helpers";
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

interface Props {
  sphere_status?: number;
  dep?: Departments;
  add: MainPermissions;
  edit: MainPermissions;
}

const column = [
  { name: "№", key: "" },
  { name: "Наименование", key: "name" },
  { name: "Отдел", key: "department" },
  { name: "Время исполнении", key: "ftime" },
  { name: "Статус", key: "status" },
  { name: "", key: "" },
];

const CategoriesIT: FC<Props> = ({ dep, add, edit }) => {
  const { sphere } = useParams();
  const navigate = useNavigate();
  const [sort, $sort] = useState<Category[]>();
  const permission = useAppSelector(permissionSelector);
  const currentPage = Number(useQueryString("page")) || 1;

  const { data: categories, isLoading } = useCategories({
    size: itemsPerPage,
    page: currentPage,
    ...(dep && { department: +dep }),
    ...(!!sphere && { sphere_status: Number(sphere) }),
  });

  const handleNavigate = (route: string) => () => navigate(route);

  return (
    <Card>
      <Header title={"Категории"}>
        {permission?.[add] && (
          <button
            className="btn btn-success btn-fill"
            onClick={handleNavigate(`add`)}
            id="add_category"
          >
            Добавить
          </button>
        )}
      </Header>

      <div className="content">
        <div className="table-responsive grid-view">
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
                      <td>{handleDepartment({ dep: category?.department })}</td>
                      <td>{category.ftime} часов</td>
                      <td>{category?.status ? "Активный" : "Неактивный"}</td>
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
          {isLoading && <Loading absolute />}
          {!categories?.items?.length && !isLoading && <EmptyList />}
          {!!categories && <Pagination totalPages={categories.pages} />}
        </div>
      </div>
    </Card>
  );
};

export default CategoriesIT;
