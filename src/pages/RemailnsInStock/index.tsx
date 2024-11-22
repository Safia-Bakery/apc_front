import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import Pagination from "@/components/Pagination";
import ItemsCount from "@/components/ItemsCount";
import TableHead from "@/components/TableHead";
import { handleIdx, numberWithCommas } from "@/utils/helpers";
import { useState } from "react";
import StockFilter from "./filter";
import dayjs from "dayjs";
import useQueryString from "custom/useQueryString";
import useRemainsInStock from "@/hooks/useRemainsInStock";
import useStockSync from "@/hooks/sync/useStockSync";
import { StockItem } from "@/utils/types";
import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { dateMonthYear } from "@/utils/keys";

const column = [
  { name: "№", key: "" },
  { name: "name_in_table", key: "name" },
  { name: "Синх.", key: "last_update" },
  { name: "Остались на складе", key: "amount_left" },
  { name: "Общая цена", key: "total_price" },
];

const RemainsInStock = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const currentPage = Number(useQueryString("page")) || 1;
  const name = useQueryString("name");
  const syncDate = useQueryString("syncDate");
  const { id } = useParams();
  const [sort, $sort] = useState<StockItem[]>();

  const { refetch: syncIIKO, isFetching: syncLoading } = useStockSync({
    store_id: id!,
    enabled: false,
  });

  const { data: products, isLoading: itemsLoading } = useRemainsInStock({
    enabled: true,
    page: currentPage,
    store_id: id!,
    ...(name && { name }),
    ...(syncDate && { syncDate }),
  });

  const handleSync = () => syncIIKO();

  return (
    <Card>
      <Header title={"remains_in_stock"}>
        <div className="flex">
          <button
            onClick={handleSync}
            className="btn btn-primary   mr-2 !flex"
            disabled={syncLoading}
          >
            <img
              src="/icons/sync.svg"
              height={20}
              width={20}
              alt="sync"
              className="mr-2"
            />
            {t("sync_with_iico")}
          </button>
          <button className="btn btn-primary" onClick={goBack}>
            {t("back")}
          </button>
        </div>
      </Header>

      <div className="table-responsive  content">
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
                  <td>{dayjs(item?.last_update).format(dateMonthYear)}</td>
                  <td>{item?.amount_left}</td>
                  <td>{numberWithCommas(item?.total_price)}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {(syncLoading || itemsLoading) && <Loading />}
        {!products?.items?.length && !itemsLoading && <EmptyList />}
        {!!products && <Pagination totalPages={products.pages} />}
      </div>
    </Card>
  );
};

export default RemainsInStock;
