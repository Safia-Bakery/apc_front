import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";

import Pagination from "src/components/Pagination";
import { useState } from "react";
import useOrders from "src/hooks/useOrders";
import { Order } from "src/utils/types";
import { itemsPerPage } from "src/utils/helpers";

const column = [
  { name: "#", key: "id" as keyof Order["id"] },
  { name: "Название", key: "purchaser" as keyof Order["purchaser"] },
  { name: "Ключ", key: "status" as keyof Order["status"] },
  { name: "Значения", key: "status" as keyof Order["status"] },
  { name: "Добавлен в", key: "status" as keyof Order["status"] },
  { name: "Автор", key: "status" as keyof Order["status"] },
  { name: "", key: "" },
];

const Settings = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

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

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleNavigate = (route: string) => () => navigate(route);

  return (
    <Card>
      <Header title={"Settings"}>
        <button className="btn btn-primary btn-fill mr-2">
          <img
            src="/assets/icons/sync.svg"
            height={20}
            width={20}
            alt="sync"
            className="mr-2"
          />
          Синхронизировать с iiko
        </button>
        <button
          className="btn btn-success btn-fill"
          onClick={handleNavigate("/add-role")}
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
                    <td>iiko-server</td>
                    <td>https://safia-co.iiko.it/resto/api/</td>
                    <td>02.09.2022 08:20</td>
                    <td>Administrator</td>
                    <td width={40}>
                      <div
                        className={styles.viewBtn}
                        onClick={handleNavigate(`/edit-role/${1}`)}
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

export default Settings;
