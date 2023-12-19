import Card from "src/components/Card";
import Header from "src/components/Header";
import { Link, useNavigate } from "react-router-dom";
import {
  Category,
  Departments,
  MainPermissions,
  Sphere,
} from "src/utils/types";
import Pagination from "src/components/Pagination";
import { FC, useEffect, useState } from "react";
import { handleDepartment, handleIdx, itemsPerPage } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import TableViewBtn from "src/components/TableViewBtn";
import useCategories from "src/hooks/useCategories";
import ItemsCount from "src/components/ItemsCount";
import useQueryString from "src/hooks/custom/useQueryString";
import { useAppSelector } from "src/store/utils/types";
import { permissionSelector } from "src/store/reducers/sidebar";
import CategoriesITFilter from "./filter";

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
  { name: "Статус", key: "status" },
  { name: "", key: "" },
];

const CategoriesIT: FC<Props> = ({ sphere_status, dep, add, edit }) => {
  const navigate = useNavigate();
  const [sort, $sort] = useState<Category[]>();
  const permission = useAppSelector(permissionSelector);
  const currentPage = Number(useQueryString("page")) || 1;
  const { data: categories, isLoading } = useCategories({
    size: itemsPerPage,
    page: currentPage,
    ...(dep && { department: +dep }),
    ...(sphere_status && { sphere_status }),
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

            {!!categories?.items?.length && (
              <tbody>
                {(sort?.length ? sort : categories?.items)?.map(
                  (category, idx) => (
                    <tr key={idx} className="bg-blue">
                      <td width={40}>{handleIdx(idx)}</td>
                      <td>
                        <Link
                          to={`${category?.id}/products?category_name=${category.name}`}
                        >
                          {category?.name}
                        </Link>
                      </td>
                      <td>{handleDepartment({ dep: category?.department })}</td>
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
            )}
          </table>
          {!!categories && <Pagination totalPages={categories.pages} />}
          {!categories?.items?.length && !isLoading && (
            <div className="w-full">
              <p className="text-center w-full ">Спосок пуст</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CategoriesIT;
