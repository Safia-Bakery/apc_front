import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";

import { Category } from "src/utils/types";
import Pagination from "src/components/Pagination";
import { useState } from "react";
import { itemsPerPage } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import TableViewBtn from "src/components/TableViewBtn";
import useCategories from "src/hooks/useCategories";

const column = [
  { name: "#", key: "" },
  { name: "Наименование", key: "name" as keyof Category["name"] },
  { name: "Статус", key: "status" as keyof Category["status"] },
  { name: "", key: "" },
];

const Categories = () => {
  const navigate = useNavigate();

  const [sortKey, setSortKey] = useState<keyof Category>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: keyof Category) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const { data: categories } = useCategories({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
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

  return (
    <Card>
      <Header title={"Categories"}>
        <button
          className="btn btn-success btn-fill"
          onClick={handleNavigate(`add`)}
        >
          Добавить
        </button>
      </Header>

      <div className="content">
        <div className="table-responsive grid-view">
          <div className={styles.summary}>
            Показаны записи <b>1-50</b> из <b>100</b>.
          </div>
          <table className="table table-hover">
            <TableHead
              column={column}
              sort={handleSort}
              sortKey={sortKey}
              sortOrder={sortOrder}
            />

            {categories?.items.length && (
              <tbody>
                {(sortData()?.length ? sortData() : categories?.items)?.map(
                  (category, idx) => (
                    <tr key={idx} className="bg-blue">
                      <td width="40">{handleIdx(idx)}</td>
                      <td>{category.name}</td>
                      <td>{category.status ? "Активный" : "Неактивный"}</td>
                      <TableViewBtn
                        onClick={handleNavigate(`/categories/${category.id}`)}
                      />
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
