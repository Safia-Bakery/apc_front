import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";
import { BrigadaType, MainPermissions, Sphere } from "src/utils/types";
import Loading from "src/components/Loader";
import Pagination from "src/components/Pagination";
import { FC, useEffect, useMemo, useState } from "react";
import { itemsPerPage } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import TableViewBtn from "src/components/TableViewBtn";
import useBrigadas from "src/hooks/useBrigadas";
import ItemsCount from "src/components/ItemsCount";
import { useAppSelector } from "src/redux/utils/types";
import { permissionSelector } from "src/redux/reducers/auth";
import useQueryString from "src/hooks/useQueryString";

interface Props {
  add: MainPermissions;
  edit: MainPermissions;
  isMaster?: boolean;
}

const Masters: FC<Props> = ({ add, edit, isMaster = false }) => {
  const navigate = useNavigate();
  const handleNavigate = (id: number | string) => () => navigate(`${id}`);
  const permission = useAppSelector(permissionSelector);
  const [currentPage, setCurrentPage] = useState(1);
  const sphere_status = useQueryString("sphere_status");

  const column = useMemo(() => {
    return [
      { name: "#", key: "id" },
      { name: "Название", key: "name" },
      { name: isMaster ? "Мастер" : "Бригадир", key: "description" },
      { name: "Описание", key: "description" },
      { name: "Статус", key: "status" },
      { name: "", key: "" },
    ];
  }, [isMaster]);
  const {
    data: brigadas,
    isLoading: orderLoading,
    refetch,
  } = useBrigadas({
    size: itemsPerPage,
    page: currentPage,
    sphere_status: Number(sphere_status),
    enabled: true,
  });

  const [sortKey, setSortKey] = useState<keyof BrigadaType>();
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
    if (brigadas?.items && sortKey) {
      const sortedData = [...brigadas?.items].sort((a, b) => {
        if (a[sortKey]! < b[sortKey]!) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey]! > b[sortKey]!) return sortOrder === "asc" ? 1 : -1;
        else return 0;
      });
      return sortedData;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handleIdx = (index: number) => {
    if (currentPage === 1) return index + 1;
    else return index + 1 + itemsPerPage * (currentPage - 1);
  };

  useEffect(() => {
    if (currentPage > 1) refetch();
  }, [currentPage]);

  if (orderLoading) return <Loading />;
  return (
    <Card>
      <Header title={isMaster ? "Мастера" : "Бригады"}>
        {permission?.[add] && (
          <button
            className="btn btn-success btn-fill"
            onClick={handleNavigate(`add?sphere_status=${sphere_status}`)}
          >
            Добавить
          </button>
        )}
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={brigadas} currentPage={currentPage} />
        <table className="table table-hover">
          <TableHead
            column={column}
            sort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
          />

          {!!brigadas?.items?.length && (
            <tbody>
              {(sortData()?.length ? sortData() : brigadas?.items)?.map(
                (order, idx) => (
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
                            `${order.id}?sphere_status=${order.sphere_status}`
                          )}
                        />
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          )}
        </table>
        {!!brigadas && (
          <Pagination
            totalItems={brigadas?.total}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
        {!brigadas?.items?.length && (
          <div className="w-100">
            <p className="text-center w-100">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Masters;