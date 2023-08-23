import Card from "src/components/Card";
import Header from "src/components/Header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MainPermissions, UsersType } from "src/utils/types";
import Loading from "src/components/Loader";
import Pagination from "src/components/Pagination";
import { useEffect, useState } from "react";
import { itemsPerPage } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import TableViewBtn from "src/components/TableViewBtn";
import useUsers from "src/hooks/useUsers";
import UsersFilter from "./filter";
import ItemsCount from "src/components/ItemsCount";
import { useAppSelector } from "src/redux/utils/types";
import { permissionSelector } from "src/redux/reducers/auth";

const column = [
  { name: "#", key: "" },
  { name: "ФИО", key: "full_name" },
  { name: "Логин", key: "username" },
  { name: "Роль", key: "group.name" },
  { name: "Телефон", key: "phone_number" },
  { name: "Статус", key: "status" },
  { name: "", key: "" },
];

const Users = () => {
  const navigate = useNavigate();
  const handleNavigate = (route: string) => () => navigate(route);
  const permission = useAppSelector(permissionSelector);
  const { pathname } = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: users,
    isLoading: orderLoading,
    refetch,
  } = useUsers({
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

  const userStatus = (item: number) => {
    if (item === 1) return "суперадмин";
    if (item === 2) return "Неактивный";
    if (item === 0) return "Активный";
  };

  useEffect(() => {
    if (currentPage > 1) refetch();
  }, [currentPage]);

  if (orderLoading) return <Loading />;

  return (
    <Card>
      <Header title={"Пользователи"}>
        {permission?.[MainPermissions.add_users] && (
          <button
            className="btn btn-success btn-fill"
            onClick={handleNavigate("/users/add")}
          >
            Добавить
          </button>
        )}
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={users} currentPage={currentPage} />
        <table className="table table-hover">
          <TableHead
            column={column}
            sort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
          >
            <UsersFilter currentPage={currentPage} />
          </TableHead>

          {!!users?.items?.length && (
            <tbody>
              {(sortData()?.length ? sortData() : users?.items)
                ?.filter((user) => user.status !== 1)
                .map((user, idx) => (
                  <tr className="bg-blue" key={idx}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td>{user.full_name}</td>
                    <td>
                      <span className="not-set">{user?.username}</span>
                    </td>
                    <td width={250}>
                      <Link
                        to={
                          permission?.[MainPermissions.edit_roles]
                            ? `/roles/${user?.group?.id}`
                            : pathname
                        }
                      >
                        {user.group?.name}
                      </Link>
                    </td>
                    <td>{user?.phone_number}</td>
                    <td>{userStatus(user?.status)}</td>
                    <td width={40}>
                      {permission?.[MainPermissions.edit_users] && (
                        <TableViewBtn onClick={handleNavigate(`${user?.id}`)} />
                      )}
                    </td>
                  </tr>
                ))}
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
