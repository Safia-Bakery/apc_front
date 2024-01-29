import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "@/components/Card";
import Header from "@/components/Header";
import {
  BrigadaType,
  Departments,
  MainPermissions,
  Sphere,
} from "@/utils/types";
import Loading from "@/components/Loader";
import Pagination from "@/components/Pagination";
import { handleIdx } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import useBrigadas from "@/hooks/useBrigadas";
import ItemsCount from "@/components/ItemsCount";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";

interface Props {
  dep: Departments;
  sphere_status?: Sphere;
  add: MainPermissions;
  edit: MainPermissions;
}

const Masters = ({ dep, sphere_status, add, edit }: Props) => {
  const navigate = useNavigate();
  const permission = useAppSelector(permissionSelector);
  const currentPage = Number(useQueryString("page")) || 1;
  const [sort, $sort] = useState<BrigadaType[]>();

  const handleNavigate = (id: number | string) => () => navigate(`${id}`);

  const renderDep = useMemo(() => {
    switch (dep) {
      case Departments.apc:
        if (sphere_status === Sphere.fabric)
          return { mainTitle: "Мастера", tableTitle: "Мастер" };
        else return { mainTitle: "Бригады", tableTitle: "Бригадир" };
      case Departments.it:
        return { mainTitle: "ИТ специалисты", tableTitle: "ИТ специалист" };

      default:
        return { mainTitle: "Мастера", tableTitle: "Мастер" };
    }
  }, [dep, sphere_status]);

  const column = useMemo(() => {
    return [
      { name: "№", key: "id" },
      { name: "Название", key: "name" },
      { name: renderDep?.tableTitle, key: "name" },
      { name: "Описание", key: "description" },
      { name: "Статус", key: "status" },
      { name: "", key: "" },
    ];
  }, []);

  const {
    data: brigadas,
    isLoading: orderLoading,
    refetch,
  } = useBrigadas({
    page: currentPage,
    enabled: true,
    ...(!!dep && { department: Number(dep) }),
    ...(!!sphere_status && { sphere_status }),
  });

  useEffect(() => {
    refetch();
  }, []);

  if (orderLoading) return <Loading absolute />;

  return (
    <Card>
      <Header title={renderDep?.mainTitle}>
        {permission?.[add] && (
          <button
            className="btn btn-success btn-fill"
            id="add_master"
            onClick={handleNavigate(
              `add?dep=${dep}&sphere_status=${sphere_status}`
            )}
          >
            Добавить
          </button>
        )}
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={brigadas} />
        <table className="table table-hover">
          <TableHead column={column} onSort={(data) => $sort(data)} />

          {!!brigadas?.items?.length && (
            <tbody>
              {(sort?.length ? sort : brigadas?.items)?.map((order, idx) => (
                <tr className="bg-blue" key={idx}>
                  <td width="40">{handleIdx(idx)}</td>
                  <td width={250}>{order.name}</td>
                  <td>
                    {!!order.user?.length
                      ? order.user?.[0]?.full_name
                      : "Не задано"}
                  </td>
                  <td>{order.description}</td>
                  <td>{!!order.status ? "Активный" : "Неактивный"}</td>
                  <td width={40}>
                    {permission?.[edit] && (
                      <TableViewBtn
                        onClick={handleNavigate(
                          `${order.id}?dep=${dep}&sphere_status=${sphere_status}`
                        )}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {!brigadas?.items?.length && !orderLoading && <EmptyList />}
        {!!brigadas && <Pagination totalPages={brigadas.pages} />}
      </div>
    </Card>
  );
};

export default Masters;
