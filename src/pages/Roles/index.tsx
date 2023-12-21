import Card from "@/components/Card";
import Header from "@/components/Header";
import { Link, useNavigate } from "react-router-dom";
import { MainPermissions, RoleTypes } from "@/utils/types";

import Loading from "@/components/Loader";
import { useState } from "react";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import useRoles from "@/hooks/useRoles";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import EmptyList from "@/components/EmptyList";

const column = [
  { name: "№", key: "" },
  { name: "Название", key: "name" },
  { name: "Статус", key: "status" },
  { name: "", key: "" },
];

const Roles = () => {
  const navigate = useNavigate();
  const handleNavigate = (route: string) => () => navigate(route);
  const permission = useAppSelector(permissionSelector);
  const [sort, $sort] = useState<RoleTypes[]>();

  const { data: roles, isLoading: orderLoading } = useRoles({});
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
            onSort={(data) => $sort(data)}
            data={roles}
          />

          {!!roles?.length && (
            <tbody>
              {(sort?.length ? sort : roles)?.map((role, idx) => (
                <tr className="bg-blue" key={role.id}>
                  <td width="40">{idx + 1}</td>
                  <td>
                    {permission?.[MainPermissions.edit_roles] ? (
                      <Link to={`/roles/${role.id}`}>{role.name}</Link>
                    ) : (
                      <span>{role?.name}</span>
                    )}
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
        {!roles?.length && !orderLoading && <EmptyList />}
      </div>
    </Card>
  );
};

export default Roles;
