import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { Link, useNavigate } from "react-router-dom";

import { UsersType } from "src/utils/types";
import Loading from "src/components/Loader";
import Pagination from "src/components/Pagination";
import { useState } from "react";
import { itemsPerPage } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import TableViewBtn from "src/components/TableViewBtn";
import useUsers from "src/hooks/useUsers";

const column = [
  { name: "#", key: "" },
  { name: "ФИО", key: "full_name" as keyof UsersType["full_name"] },
  { name: "Логин", key: "username" as keyof UsersType["username"] },
  { name: "Роль", key: "group.name" as keyof UsersType["username"] },
  { name: "Телефон", key: "phone_number" as keyof UsersType["phone_number"] },
  { name: "Статус", key: "status" as keyof UsersType["status"] },
  { name: "", key: "" },
];

const Users = () => {
  const navigate = useNavigate();
  const handleNavigate = (route: string) => () => navigate(route);

  const [currentPage, setCurrentPage] = useState(1);
  const { data: users, isLoading: orderLoading } = useUsers({
    size: itemsPerPage,
    page: currentPage,
  });

  const [sortKey, setSortKey] = useState<keyof UsersType>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  function handleSort(key: keyof UsersType) {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  }

  const sortData = () => {
    if (users?.items && sortKey) {
      const sortedData = [...users?.items].sort((a, b) => {
        if (a[sortKey]! < b[sortKey]!) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey]! > b[sortKey]!) return sortOrder === "asc" ? 1 : -1;
        else return 0;
      });
      return sortedData;
    }
  };

  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleIdx = (index: number) => {
    if (currentPage === 1) return index + 1;
    else return index + 1 + itemsPerPage * (currentPage - 1);
  };

  if (orderLoading) return <Loading />;

  return (
    <Card>
      <Header title={"Users"}>
        <button
          className="btn btn-success btn-fill"
          onClick={handleNavigate("/users/add")}
        >
          Добавить
        </button>
      </Header>

      <div className="table-responsive grid-view content">
        <div className={styles.summary}>
          Показаны записи <b>1-{users?.items.length}</b> из{" "}
          <b>{users?.total}</b>.
        </div>
        <table className="table table-hover">
          <TableHead
            column={column}
            sort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
          />

          {users?.items?.length && (
            <tbody>
              {(sortData()?.length ? sortData() : users?.items)?.map(
                (user, idx) => (
                  <tr className="bg-blue" key={idx}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td>{user.full_name}</td>
                    <td>
                      <span className="not-set">{user?.username}</span>
                    </td>
                    <td width={250}>
                      <Link to={`/roles/${user.group?.id}`}>
                        {user.group?.name}
                      </Link>
                    </td>
                    <td>{user?.phone_number}</td>
                    <td>{user.status ? "Активный" : "Неактивный"}</td>
                    {/* <td className="text-center" width={140}>
                      {dayjs(order.time_created).format("DD-MM-YYYY HH:mm")}
                    </td> */}
                    <TableViewBtn onClick={handleNavigate(`${user.id}`)} />
                  </tr>
                )
              )}
            </tbody>
          )}
        </table>
        {!!users && (
          <Pagination
            totalItems={users?.total}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
        {!users?.items?.length && (
          <div className="w-100">
            <p className="text-center w-100 ">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Users;
