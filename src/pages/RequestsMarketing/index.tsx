import { Link, useNavigate } from "react-router-dom";
import { MainPermissions, Order } from "src/utils/types";
import Loading from "src/components/Loader";
import Pagination from "src/components/Pagination";
import { FC, useEffect, useState } from "react";
import dayjs from "dayjs";
import useOrders from "src/hooks/useOrders";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { handleStatus, itemsPerPage, requestRows } from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import InventoryFilter from "./filter";
import ItemsCount from "src/components/ItemsCount";
import { useAppSelector } from "src/redux/utils/types";
import { permissionSelector } from "src/redux/reducers/auth";
import styles from "./index.module.scss";

const column = [
  { name: "#", key: "" },
  { name: "Номер заявки", key: "id" },
  { name: "Имя", key: "type" },
  { name: "Номер телефона", key: "fillial.name" },
  { name: "Подкатегория", key: "fillial.name" },
  { name: "Филиал", key: "fillial.name" },
  { name: "Дата оформления", key: "fillial.name" },
  {
    name: "Статус",
    key: "status",
  },
  { name: "Изменил", key: "category.name" },
];

interface Props {
  title?: string;
  sub_id?: string | number;
  add: MainPermissions;
  edit: MainPermissions;
}

const RequestsMarketing: FC<Props> = ({ title, sub_id, add, edit }) => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<keyof Order>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const permission = useAppSelector(permissionSelector);

  const handleSort = (key: any) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: requests,
    refetch,
    isLoading: orderLoading,
  } = useOrders({
    enabled: true,
    size: itemsPerPage,
    page: currentPage,
    sub_id: Number(sub_id),
  });

  const sortData = () => {
    if (requests?.items && sortKey) {
      const sortedData = [...requests?.items].sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
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

  useEffect(() => {
    refetch();
  }, [currentPage]);

  if (orderLoading) return <Loading />;

  return (
    <Card>
      <Header title={title}>
        {permission?.[add] && (
          <button
            onClick={() => navigate(`add?sub_id=${sub_id}`)}
            className="btn btn-success btn-fill"
          >
            Добавить
          </button>
        )}
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={requests} currentPage={currentPage} />
        <table className="table table-hover">
          <TableHead
            column={column}
            sort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
          >
            <InventoryFilter sub_id={sub_id} currentPage={currentPage} />
          </TableHead>

          {!!requests?.items?.length && (
            <tbody>
              {(sortData()?.length ? sortData() : requests?.items)?.map(
                (order, idx) => (
                  <tr className={requestRows(order.status)} key={idx}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td width="80">
                      {permission?.[edit] ? (
                        <Link to={`/requests-apc/${order?.id}`}>
                          {order?.id}
                        </Link>
                      ) : (
                        <span className={styles.link}>{order?.id}</span>
                      )}
                    </td>
                    <td>
                      <span className="not-set">{order?.user?.full_name}</span>
                    </td>
                    <td>{order?.user?.phone_number}</td>
                    <td>{order?.category?.name}</td>
                    <td>{order?.fillial?.name}</td>
                    {/* <td width={100} className={styles.text}>
                      {order?.description}
                    </td> */}
                    <td>
                      {dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")}
                    </td>
                    <td>{handleStatus(order?.status)}</td>
                    <td>
                      {order?.user_manager ? order?.user_manager : "Не задано"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          )}
        </table>
        {!!requests && (
          <Pagination
            totalItems={requests?.total}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
        {!requests?.items?.length && (
          <div className="w-100">
            <p className="text-center w-100">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RequestsMarketing;
