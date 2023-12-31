import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { Category, Departments, MainPermissions, Sphere } from "@/utils/types";
import Pagination from "@/components/Pagination";
import { handleDepartment, handleIdx, itemsPerPage } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import useCategories from "@/hooks/useCategories";
import CategoriesFilter from "./filter";
import ItemsCount from "@/components/ItemsCount";
import useQueryString from "custom/useQueryString";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import EmptyList from "@/components/EmptyList";
import TableLoading from "@/components/TableLoading";

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

const Categories: FC<Props> = ({ sphere_status, dep, add, edit }) => {
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
              <CategoriesFilter />
            </TableHead>

            <tbody>
              {!!categories?.items?.length &&
                (sort?.length ? sort : categories?.items)?.map(
                  (category, idx) => (
                    <tr key={idx} className="bg-blue">
                      <td width="40">{handleIdx(idx)}</td>
                      <td>{category?.name}</td>
                      <td>
                        {handleDepartment({
                          ...(!!category?.sub_id
                            ? { sub: category?.sub_id }
                            : { dep: category?.department }),
                        })}
                      </td>
                      <td>{category?.status ? "Активный" : "Неактивный"}</td>
                      <td width={40}>
                        {permission?.[edit] && (
                          <TableViewBtn
                            onClick={handleNavigate(
                              `/categories-${Departments[Number(dep)]}${
                                !!sphere_status
                                  ? `-${Sphere[sphere_status]}`
                                  : ""
                              }/${category.id}?dep=${category?.department}${
                                !!category?.sub_id
                                  ? `&sub_id=${category.sub_id}`
                                  : ""
                              }`
                            )}
                          />
                        )}
                      </td>
                    </tr>
                  )
                )}
              {isLoading && <TableLoading />}
            </tbody>
          </table>

          {!!categories && <Pagination totalPages={categories.pages} />}
          {!categories?.items?.length && !isLoading && <EmptyList />}
        </div>
      </div>
    </Card>
  );
};

export default Categories;
