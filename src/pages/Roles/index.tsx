import Card from "src/components/Card";
import Header from "src/components/Header";
import { Link, useNavigate } from "react-router-dom";
import { MainPermissions, RoleTypes } from "src/utils/types";

import Loading from "src/components/Loader";
import { useState } from "react";
import TableHead from "src/components/TableHead";
import TableViewBtn from "src/components/TableViewBtn";
import useRoles from "src/hooks/useRoles";
import { useAppSelector } from "src/redux/utils/types";
import { permissionSelector } from "src/redux/reducers/auth";

const column = [
  { name: "#", key: "" },
  { name: "Название", key: "name" },
  { name: "Статус", key: "status" },
  { name: "", key: "" },
];

const Roles = () => {
  const navigate = useNavigate();
  const handleNavigate = (route: string) => () => navigate(route);
  const permission = useAppSelector(permissionSelector);

  const { data: roles, isLoading: orderLoading } = useRoles({});

  const [sortKey, setSortKey] = useState<keyof RoleTypes>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (key: any) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortData = () => {
    if (roles && sortKey) {
      const sortedData = [...roles].sort((a, b) => {
        if (a[sortKey]! < b[sortKey]!) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey]! > b[sortKey]!) return sortOrder === "asc" ? 1 : -1;
        else return 0;
      });
      return sortedData;
    }
  };

  if (orderLoading) return <Loading />;

  return (
    <Card>
      <Header title={"Роли"}>
        {permission?.[MainPermissions.add_role] && (
          <button
            className="btn btn-success btn-fill"
            onClick={handleNavigate("add")}
          >
            Добавить
          </button>
        )}
      </Header>

      <div className="table-responsive grid-view content">
        <table className="table table-hover">
          <TableHead
            column={column}
            sort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
          />

          {!!roles?.length && (
            <tbody>
              {(sortData()?.length ? sortData() : roles)?.map((role, idx) => (
                <tr className="bg-blue" key={role.id}>
                  <td width="40">{idx + 1}</td>
                  <td>
                    <Link to={`/roles/${role.id}`}>{role.name}</Link>
                  </td>
                  <td>{!role.status ? "Не активный" : "Активный"}</td>
                  <td width={40}>
                    {permission?.[MainPermissions.edit_roles] && (
                      <TableViewBtn
                        onClick={handleNavigate(`edit/${role.id}`)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {!roles?.length && (
          <div className="w-100">
            <p className="text-center w-100">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Roles;
