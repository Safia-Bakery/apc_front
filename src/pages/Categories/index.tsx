import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";
import {
  Category,
  Departments,
  MainPermissions,
  Sphere,
} from "src/utils/types";
import Pagination from "src/components/Pagination";
import { FC, useEffect, useState } from "react";
import { handleDepartment, itemsPerPage } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import TableViewBtn from "src/components/TableViewBtn";
import useCategories from "src/hooks/useCategories";
import CategoriesFilter from "./filter";
import ItemsCount from "src/components/ItemsCount";
import useQueryString from "src/hooks/useQueryString";
import { useAppSelector } from "src/redux/utils/types";
import { permissionSelector } from "src/redux/reducers/auth";

interface Props {
  sphere_status?: number;
  dep?: Departments;
  add: MainPermissions;
  edit: MainPermissions;
}

const column = [
  { name: "#", key: "" },
  { name: "Наименование", key: "name" },
  { name: "Отдел", key: "department" },
  { name: "Статус", key: "status" },
  { name: "", key: "" },
];

const Categories: FC<Props> = ({ sphere_status, dep, add, edit }) => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<keyof Category>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const permission = useAppSelector(permissionSelector);

  const handleSort = (key: keyof Category) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const { data: categories, refetch } = useCategories({
    size: itemsPerPage,
    page: currentPage,
    ...(dep && { department: +dep }),
    ...(sphere_status && { sphere_status }),
  });

  const sortData = () => {
    if (categories?.items && sortKey) {
      const sortedData = [...categories?.items].sort((a, b) => {
        if (a[sortKey]! < b[sortKey]!) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey]! > b[sortKey]!) return sortOrder === "asc" ? 1 : -1;
        else return 0;
      });
      return sortedData;
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNavigate = (route: string) => () => navigate(route);

  const handleIdx = (index: number) => {
    if (currentPage === 1) return index + 1;
    else return index + 1 + itemsPerPage * (currentPage - 1);
  };
  useEffect(() => {
    if (currentPage > 1) refetch();
  }, [currentPage]);

  return (
    <Card>
      <Header title={"Категории"}>
        {permission?.[add] && (
          <button
            className="btn btn-success btn-fill"
            onClick={handleNavigate(`add`)}
          >
            Добавить
          </button>
        )}
      </Header>

      <div className="content">
        <div className="table-responsive grid-view">
          <ItemsCount data={categories} currentPage={currentPage} />
          <table className="table table-hover">
            <TableHead
              column={column}
              sort={handleSort}
              sortKey={sortKey}
              sortOrder={sortOrder}
            >
              <CategoriesFilter currentPage={currentPage} />
            </TableHead>

            {!!categories?.items?.length && (
              <tbody>
                {(sortData()?.length ? sortData() : categories?.items)?.map(
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
              </tbody>
            )}
          </table>
          {!!categories && (
            <Pagination
              totalItems={categories?.total}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
          {!categories?.items?.length && (
            <div className="w-100">
              <p className="text-center w-100 ">Спосок пуст</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Categories;
