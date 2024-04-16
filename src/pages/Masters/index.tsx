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
import { useTranslation } from "react-i18next";

interface Props {
  dep: Departments;
  sphere_status?: Sphere;
  add: MainPermissions;
  edit: MainPermissions;
}

const Masters = ({ dep, sphere_status, add, edit }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const permission = useAppSelector(permissionSelector);
  const currentPage = Number(useQueryString("page")) || 1;
  const [sort, $sort] = useState<BrigadaType[]>();

  const handleNavigate = (id: number | string) => () => navigate(`${id}`);

  const renderDep = useMemo(() => {
    switch (dep) {
      case Departments.APC:
        if (sphere_status === Sphere.fabric)
          return { mainTitle: "masters", tableTitle: "master" };
        else return { mainTitle: "brigades", tableTitle: "brigadir" };
      case Departments.IT:
        return { mainTitle: "it_specialists", tableTitle: "it_specialist" };

      default:
        return { mainTitle: "masters", tableTitle: "master" };
    }
  }, [dep, sphere_status]);

  const column = useMemo(() => {
    return [
      { name: "№", key: "id" },
      { name: "name", key: "name" },
      { name: renderDep?.tableTitle, key: "name" },
      { name: "description", key: "description" },
      { name: "status", key: "status" },
      { name: "", key: "" },
    ];
  }, []);

  const {
    data: brigadas,
    isLoading: orderLoading,
    isFetching,
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

  if (orderLoading || isFetching) return <Loading />;

  return (
    <Card>
      <Header title={renderDep?.mainTitle}>
        {permission?.[add] && (
          <button
            className="btn btn-success  "
            id="add_master"
            onClick={handleNavigate(
              `add?dep=${dep}&sphere_status=${sphere_status}`
            )}
          >
            {t("add")}
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
                      : t("not_given")}
                  </td>
                  <td>{order.description}</td>
                  <td>{!!order.status ? t("active") : t("not_active")}</td>
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
