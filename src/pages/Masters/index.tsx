import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "@/components/Card";
import Header from "@/components/Header";
import { BrigadaType, MainPermissions } from "@/utils/types";
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

const Masters = () => {
  const navigate = useNavigate();
  const permission = useAppSelector(permissionSelector);
  const sphere_status = Number(useQueryString("sphere_status"));
  const dep = useQueryString("dep");
  const currentPage = Number(useQueryString("page")) || 1;
  const [sort, $sort] = useState<BrigadaType[]>();

  const add = Number(useQueryString("add")) as MainPermissions;
  const edit = Number(useQueryString("edit")) as MainPermissions;

  const handleNavigate = (id: number | string) => () => navigate(`${id}`);

  const column = useMemo(() => {
    return [
      { name: "№", key: "id" },
      { name: "Название", key: "name" },
      { name: "Мастер", key: "description" },
      { name: "Описание", key: "description" },
      { name: "Статус", key: "status" },
      { name: "", key: "" },
    ];
  }, []);
  const { data: brigadas, isLoading: orderLoading } = useBrigadas({
    page: currentPage,
    enabled: true,
    ...(!!dep && { department: Number(dep) }),
    ...(!!sphere_status && { sphere_status }),
  });

  if (orderLoading) return <Loading absolute />;

  return (
    <Card>
      <Header title={"Мастера"}>
        {permission?.[add] && (
          <button
            className="btn btn-success btn-fill"
            id="add_master"
            onClick={handleNavigate(
              `add?${dep ? `dep=${dep}` : `sphere_status=${sphere_status}`}`
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
                          `${order.id}?${
                            dep
                              ? `dep=${dep}`
                              : `sphere_status=${sphere_status}`
                          }`
                        )}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {!!brigadas && <Pagination totalPages={brigadas.pages} />}
        {!brigadas?.items?.length && !orderLoading && <EmptyList />}
      </div>
    </Card>
  );
};

export default Masters;
