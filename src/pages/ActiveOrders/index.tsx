import styles from "./index.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { Order } from "src/utils/types";
import Loading from "src/components/Loader";
import Pagination from "src/components/Pagination";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import useOrders from "src/hooks/useOrders";
import Card from "src/components/Card";
import Header from "src/components/Header";
import {
  OrderTypeNames,
  StatusName,
  UrgentNames,
  itemsPerPage,
} from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import BaseSelect from "src/components/BaseSelect";
import InputBlock from "src/components/Input";
import { useForm } from "react-hook-form";
import { useAppSelector } from "src/redux/utils/types";
import {
  branchSelector,
  brigadaSelector,
  categorySelector,
} from "src/redux/reducers/cacheResources";
import DateInput from "src/components/DateRangeInput";

const column = [
  { name: "#", key: "" },
  { name: "Номер", key: "id" as keyof Order["id"] },
  { name: "Тип", key: "type" as keyof Order["product"] },
  { name: "Отдел", key: "fillial.name" as keyof Order["category"] },
  { name: "Группа проблем", key: "category.name" as keyof Order["category"] },
  {
    name: "Срочно",
    key: "urgent" as keyof Order["category"],
  },
  { name: "Дата выполнения", key: "finished_at" as keyof Order["finished_at"] },
  { name: "Дата", key: "created_at" as keyof Order["created_at"] },
  { name: "Статус", key: "status" as keyof Order["status"] },
  { name: "Автор", key: "brigada.name" as keyof Order["status"] },
];

const ActiveOrders = () => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<keyof Order>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const branches = useAppSelector(branchSelector);
  const categories = useAppSelector(categorySelector);
  const brigadas = useAppSelector(brigadaSelector);

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
    data: orders,
    refetch,
    isLoading: orderLoading,
  } = useOrders({ size: itemsPerPage, page: currentPage, enabled: false });

  const sortData = () => {
    if (orders?.items && sortKey) {
      const sortedData = [...orders?.items].sort((a, b) => {
        if (a[sortKey]! < b[sortKey]!) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey]! > b[sortKey]!) return sortOrder === "asc" ? 1 : -1;
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

  const handleDateRangeSelected = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    // Handle the selected date range
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
  };

  const { register, getValues } = useForm();

  useEffect(() => {
    refetch();
  }, [currentPage]);

  if (orderLoading) return <Loading />;

  return (
    <Card>
      <Header title={"Orders"}>
        <button className="btn btn-primary btn-fill mr-2">Экспорт</button>
        <button
          onClick={() => navigate("add")}
          className="btn btn-success btn-fill"
        >
          Добавить
        </button>
      </Header>

      <div className="table-responsive grid-view content">
        <div className={styles.summary}>
          Показаны записи <b>1-{orders?.items.length}</b> из{" "}
          <b>{orders?.total}</b>.
        </div>
        <table className="table table-hover">
          <TableHead
            column={column}
            sort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
          >
            <td></td>
            <td className="p-0">
              <InputBlock
                register={register("name")}
                blockClass={"m-2"}
                inputType="number"
                className="form-control"
              />
            </td>
            <td className="p-0">
              <BaseSelect
                blockClass={"m-2"}
                register={register("type")}
                value={OrderTypeNames}
              />
            </td>
            <td className="p-0">
              <BaseSelect
                blockClass={"m-2"}
                register={register("fillials")}
                value={branches}
              />
            </td>
            <td className="p-0">
              <BaseSelect
                blockClass={"m-2"}
                register={register("category")}
                value={categories}
              />
            </td>
            <td className="p-0">
              <BaseSelect
                blockClass={"m-2"}
                register={register("urgent")}
                value={UrgentNames}
              />
            </td>
            <td className="p-0">
              <DateInput
                blockClass={"m-2"}
                register={register("urgent")}
                onDateRangeSelected={handleDateRangeSelected}
              />
            </td>
            <td className="p-0">
              <DateInput
                register={register("urgent")}
                blockClass={"m-2"}
                onDateRangeSelected={handleDateRangeSelected}
              />
            </td>
            <td className="p-0">
              <BaseSelect
                blockClass={"m-2"}
                register={register("status")}
                value={StatusName}
              />
            </td>
            <td className="p-0">
              <BaseSelect
                blockClass={"m-2"}
                register={register("brigada")}
                value={brigadas}
              />
            </td>
            <td></td>
          </TableHead>

          {orders?.items.length && (
            <tbody>
              {(sortData()?.length ? sortData() : orders?.items)?.map(
                (order, idx) => (
                  <tr className="bg-blue" key={idx}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td width="80">
                      <Link to={`/orders/${order?.id}`}>{order?.id}</Link>
                    </td>
                    <td>APC</td>
                    <td>
                      <span className="not-set">{order?.fillial?.name}</span>
                    </td>
                    <td>{order?.category?.name}</td>
                    <td>{!order?.urgent ? "Несрочный" : "Срочный"}</td>
                    <td>
                      {dayjs(order?.finished_at).format("DD-MM-YYYY HH:mm")}
                    </td>
                    <td>
                      {dayjs(order?.created_at).format("DD-MM-YYYY HH:mm")}
                    </td>
                    <td>{order.status ? "Активный" : "Неактивный"}</td>
                    <td>{order?.brigada?.name}</td>
                  </tr>
                )
              )}
            </tbody>
          )}
        </table>
        {!!orders && (
          <Pagination
            totalItems={orders?.total}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
        {!orders?.items?.length && (
          <div className="w-100">
            <p className="text-center w-100">Спосок пуст</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActiveOrders;
