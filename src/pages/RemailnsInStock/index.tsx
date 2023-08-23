import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "src/components/Pagination";
import ItemsCount from "src/components/ItemsCount";
import TableHead from "src/components/TableHead";
import { itemsPerPage, requestRows } from "src/utils/helpers";
import useOrders from "src/hooks/useOrders";
import { useEffect, useState } from "react";
import StockFilter from "./filter";
import dayjs from "dayjs";
import TableViewBtn from "src/components/TableViewBtn";

const column = [
  { name: "#", key: "" },
  { name: "Наименование", key: "name" },
  { name: "Синх.", key: "fillial.name" },
  { name: "Актив", key: "category.name" },
  { name: "", key: "" },
];

const RemainsInStock = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const handleNavigate = (route: string) => () => navigate(route);

  const [sortKey, setSortKey] = useState();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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

  return (
    <Card>
      <Header title={"Остатки на складах"}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
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
            <StockFilter currentPage={currentPage} />
          </TableHead>

          {!!requests?.items?.length && (
            <tbody>
              {(sortData()?.length ? sortData() : requests?.items)?.map(
                (order, idx) => (
                  <tr key={idx}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td>
                      <Link to={`${order?.id}`}>{order?.id}</Link>
                    </td>
                    <td>
                      {dayjs(order?.created_at).format("DD.MM.YYYY HH:mm")}
                    </td>
                    <td>{order?.user?.full_name}</td>
                    <td width={40}>
                      <TableViewBtn onClick={handleNavigate(`${order.id}`)} />
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

export default RemainsInStock;
