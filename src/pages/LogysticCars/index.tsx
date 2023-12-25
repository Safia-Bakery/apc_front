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
  { name: "Модель машины", key: "name" },
  { name: "Номер", key: "car_number" },
  { name: "Статус", key: "status" },
  { name: "", key: "" },
];

const LogysticCars = () => {
  const navigate = useNavigate();
  const handleNavigate = (route: string) => () => navigate(route);
  const permission = useAppSelector(permissionSelector);
  const [sort, $sort] = useState<RoleTypes[]>();

  const { data: roles, isLoading: orderLoading } = useRoles({});
  if (orderLoading) return <Loading />;

  return (
    <Card>
      <Header title="Грузовики">
        {permission?.[MainPermissions.add_log_cars] && (
          <button
            className="btn btn-success btn-fill"
            onClick={handleNavigate("add")}
          >
            Добавить грузовика
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
              {(sort?.length ? sort : roles)?.map((car, idx) => (
                <tr className="bg-blue" key={car.id}>
                  <td width="40">{idx + 1}</td>
                  <td>{car?.name}</td>
                  <td>{car?.name}</td>
                  <td>{!car.status ? "Не активный" : "Активный"}</td>
                  <td width={40}>
                    {permission?.[MainPermissions.edit_log_cars] && (
                      <TableViewBtn onClick={handleNavigate(`${car.id}`)} />
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

export default LogysticCars;
