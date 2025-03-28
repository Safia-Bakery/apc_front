import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Card from "@/components/Card";
import Header from "@/components/Header";
import { CarsTypes } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import Loading from "@/components/Loader";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import EmptyList from "@/components/EmptyList";
import useCars from "@/hooks/useCars";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№", key: "" },
  { name: "car_model", key: "name" },
  { name: "num", key: "car_number" },
  { name: "status", key: "status" },
  { name: "", key: "" },
];

const LogysticCars = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigate = (route: string) => () => navigate(route);
  const permission = useAppSelector(permissionSelector);
  const [sort, $sort] = useState<CarsTypes[]>();

  const { data: cars, isLoading: carsLoading } = useCars({});

  if (carsLoading) return <Loading />;

  return (
    <Card>
      <Header title="tracks">
        {permission?.has(MainPermissions.add_log_cars) && (
          <button className="btn btn-success  " onClick={handleNavigate("add")}>
            {t("add_track")}
          </button>
        )}
      </Header>

      <div className="table-responsive  content">
        <table className="table table-hover">
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={cars}
          />

          {!!cars?.length && (
            <tbody>
              {(sort?.length ? sort : cars)?.map((car, idx) => (
                <tr className="bg-blue" key={car.id}>
                  <td width="40">{idx + 1}</td>
                  <td>{car?.name}</td>
                  <td>{car?.number}</td>
                  <td>{!car.status ? t("not_active") : t("active")}</td>
                  <td width={40}>
                    {permission?.has(MainPermissions.edit_log_cars) && (
                      <TableViewBtn onClick={handleNavigate(`${car.id}`)} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {!cars?.length && !carsLoading && <EmptyList />}
      </div>
    </Card>
  );
};

export default LogysticCars;
