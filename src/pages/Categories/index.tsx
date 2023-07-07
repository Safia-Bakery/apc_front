import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";

import { Order } from "src/utils/types";
import Pagination from "src/components/Pagination";
import { useState } from "react";
import useOrders from "src/hooks/useOrders";
import { itemsPerPage } from "src/utils/helpers";

const column = [
  { name: "#", key: "id" as keyof Order["id"] },
  { name: "Наименование", key: "purchaser" as keyof Order["purchaser"] },
  { name: "Статус", key: "status" as keyof Order["status"] },
  { name: "", key: "" },
];

const Categories = () => {
  const navigate = useNavigate();

  const [sortKey, setSortKey] = useState<any>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: any) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const { data: orders } = useOrders({ size: itemsPerPage, page: currentPage });

  // const sortData = () => {
  //   if (orders?.items && sortKey) {
  //     const sortedData = [...orders?.items].sort((a, b) => {
  //       if (a[sortKey]! < b[sortKey]!) return sortOrder === "asc" ? -1 : 1;
  //       if (a[sortKey]! > b[sortKey]!) return sortOrder === "asc" ? 1 : -1;
  //       else return 0;
  //     });
  //     return sortedData;
  //   }
  // };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNavigate = (route: string) => () => navigate(route);

  return (
    <Card>
      <Header title={"Categories"}>
        <button
          className="btn btn-success btn-fill"
          onClick={handleNavigate(`/add-category`)}
        >
          Добавить
        </button>
      </Header>

      <div className={styles.content}>
        <div className="table-responsive grid-view p-2">
          <div className={styles.summary}>
            Показаны записи <b>1-50</b> из <b>100</b>.
          </div>
          <table className="table table-hover">
            <thead>
              <tr>
                {column.map(({ name, key }) => {
                  return (
                    <th
                      onClick={() => handleSort(key)}
                      className={styles.tableHead}
                      key={name}
                    >
                      {name}{" "}
                      {sortKey === key && (
                        <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>

            {orders?.items.length && (
              <tbody>
                {[...Array(6)]?.map((order, idx) => (
                  <tr key={idx} className="bg-blue">
                    <td width="40">1</td>
                    <td>test name</td>
                    <td>Активный</td>
                    <td width={40}>
                      <div
                        className={styles.viewBtn}
                        onClick={handleNavigate(`/categories/${1}`)}
                      >
                        <img
                          className={styles.viewImg}
                          src="/assets/icons/edit.svg"
                          alt="edit"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
          {!!orders && (
            <Pagination
              totalItems={orders?.total}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
          {!orders?.items?.length && (
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
