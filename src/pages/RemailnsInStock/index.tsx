import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "src/components/Pagination";
import ItemsCount from "src/components/ItemsCount";
import TableHead from "src/components/TableHead";
import { itemsPerPage } from "src/utils/helpers";
import { useState } from "react";
import StockFilter from "./filter";
import dayjs from "dayjs";
import useQueryString from "src/hooks/custom/useQueryString";
import useRemainsInStock from "src/hooks/useRemainsInStock";
import useStockSync from "src/hooks/sync/useStockSync";
import Loading from "src/components/Loader";

const column = [
  { name: "№", key: "" },
  { name: "Наименование", key: "name" },
  { name: "Синх.", key: "last_update" },
  { name: "Остались на складе", key: "amount_left" },
  { name: "Общая цена", key: "total_price" },
];

const RemainsInStock = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const currentPage = Number(useQueryString("page")) || 1;
  const { id } = useParams();

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

  const { refetch: syncIIKO, isFetching: syncLoading } = useStockSync({
    store_id: id!,
    enabled: false,
  });

  const { data: items, isLoading: itemsLoading } = useRemainsInStock({
    enabled: true,
    size: itemsPerPage,
    page: currentPage,
    store_id: id!,
  });

  const sortData = () => {
    if (items?.items && sortKey) {
      const sortedData = [...items?.items].sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
        else return 0;
      });
      return sortedData;
    }
  };

  const handleIdx = (index: number) => {
    if (currentPage === 1) return index + 1;
    else return index + 1 + itemsPerPage * (currentPage - 1);
  };

  const handleSync = () => syncIIKO();

  return (
    <Card>
      <Header title={"Остатки на складах"}>
        <div className="flex">
          <button
            onClick={handleSync}
            className="btn btn-primary btn-fill mr-2 !flex"
          >
            <img
              src="/assets/icons/sync.svg"
              height={20}
              width={20}
              alt="sync"
              className="mr-2"
            />
            Синхронизировать с iiko
          </button>
          <button className="btn btn-primary btn-fill " onClick={goBack}>
            Назад
          </button>
        </div>
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={items} />
        <table className="table table-hover">
          <TableHead
            column={column}
            sort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
          >
            <StockFilter />
          </TableHead>

          {!!items?.items?.length && !itemsLoading && (
            <tbody>
              {(sortData()?.length ? sortData() : items?.items)?.map(
                (item, idx) => (
                  <tr key={idx}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td>{item?.name}</td>
                    <td>
                      {dayjs(item?.last_update).format("DD.MM.YYYY HH:mm")}
                    </td>
                    <td>{item?.amount_left}</td>
                    <td>{item?.total_price}</td>
                  </tr>
                )
              )}
              {(syncLoading || itemsLoading) && (
                <tr>
                  <td>
                    <Loading />
                  </td>
                </tr>
              )}
            </tbody>
          )}
        </table>
        {!!items && <Pagination totalPages={items.pages} />}
        {!items?.items?.length && !itemsLoading && (
          <div className="w-full">
            <p className="text-center w-full">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RemainsInStock;
