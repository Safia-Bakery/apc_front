import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "src/components/Pagination";
import ItemsCount from "src/components/ItemsCount";
import TableHead from "src/components/TableHead";
import { handleIdx, itemsPerPage } from "src/utils/helpers";
import { useState } from "react";
import StockFilter from "./filter";
import dayjs from "dayjs";
import useQueryString from "src/hooks/custom/useQueryString";
import useRemainsInStock from "src/hooks/useRemainsInStock";
import useStockSync from "src/hooks/sync/useStockSync";
import TableLoading from "src/components/TableLoading";
import { StockItem } from "src/utils/types";

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
  const [sort, $sort] = useState<StockItem[]>();

  const { refetch: syncIIKO, isFetching: syncLoading } = useStockSync({
    store_id: id!,
    enabled: false,
  });

  const { data: products, isLoading: itemsLoading } = useRemainsInStock({
    enabled: true,
    size: itemsPerPage,
    page: currentPage,
    store_id: id!,
  });

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
          <button className="btn btn-primary btn-fill" onClick={goBack}>
            Назад
          </button>
        </div>
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={products} />
        <table className="table table-hover">
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={products?.items}
          >
            <StockFilter />
          </TableHead>

          {!!products?.items?.length && !itemsLoading && (
            <tbody>
              {(sort?.length ? sort : products?.items)?.map((item, idx) => (
                <tr key={idx}>
                  <td width="40">{handleIdx(idx)}</td>
                  <td>{item?.name}</td>
                  <td>{dayjs(item?.last_update).format("DD.MM.YYYY")}</td>
                  <td>{item?.amount_left}</td>
                  <td>{item?.total_price}</td>
                </tr>
              ))}
              {(syncLoading || itemsLoading) && <TableLoading />}
            </tbody>
          )}
        </table>
        {!!products && <Pagination totalPages={products.pages} />}
        {!products?.items?.length && !itemsLoading && (
          <div className="w-full">
            <p className="text-center w-full">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RemainsInStock;
