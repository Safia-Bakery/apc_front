import Container from "src/components/Container";
import styles from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "src/redux/utils/types";
import { roleSelector, tokenSelector } from "src/redux/reducers/authReducer";
import { StatusRoles, Status, Order } from "src/utils/types";
import { errorToast, successToast } from "src/utils/toast";
import Loading from "src/components/Loader";
import { handleStatus, numberWithCommas, rowColor } from "src/utils/helpers";
import Pagination from "src/components/Pagination";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import useOrders from "src/hooks/useOrders";

const itemsPerPage = 20;

const ActiveOrders = () => {
  const navigate = useNavigate();
  // const createOrder = () => navigate("/create-orders");
  const me = useAppSelector(roleSelector);
  const admin =
    me?.role !== StatusRoles.purchasing && me?.role !== StatusRoles.superadmin;
  const [submitting, $submitting] = useState(false);

  const token = useAppSelector(tokenSelector);

  console.log(token, "token");

  const [sortKey, setSortKey] = useState<keyof Order>();
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
    data: orders,
    refetch,
    isLoading: orderLoading,
  } = useOrders({ size: itemsPerPage, page: currentPage });

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

  const handleNavigate = (id: number) => () => navigate(`/order/${id}`);

  const handleStatusSubmit =
    (body: { order_id: number; status: Status }) => () => {
      $submitting(true);
      // mutate(body, {
      //   onSuccess: () => {
      //     refetch();
      //     body.status === Status.accepted
      //       ? successToast("успешно принито")
      //       : successToast("успешно отклонено");

      //     $submitting(false);
      //   },
      //   onError: (error: any) => {
      //     errorToast(error.toString());
      //     $submitting(false);
      //   },
      // });
    };

  const handleIdx = (index: number) => {
    if (currentPage === 1) return index + 1;
    else return index + 1 + itemsPerPage * (currentPage - 1);
  };

  const column = [
    { name: "#", key: "id" as keyof Order["id"] },
    { name: "Заказчик", key: "purchaser" as keyof Order["purchaser"] },
    { name: "Отдел", key: "category.name" as keyof Order["category"] },
    { name: "Название товара", key: "product" as keyof Order["product"] },
    { name: "Цена (UZS)", key: "price" as keyof Order["price"] },
    {
      name: "Время поступления",
      key: "time_created" as keyof Order["time_created"],
    },
    { name: "Статус", key: "status" as keyof Order["status"] },
    admin ? { name: "Дествия", key: "" } : { name: "", key: "" },
  ];

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  if (orderLoading) return <Loading />;

  return (
    <Container>
      <div className="d-flex flex-column">
        <h1>Активные заказы</h1>
        {/* <button onClick={createOrder} className={`btn btn-info btn-fill mb-4 ${styles.btn}`}>
          Создать
        </button> */}
      </div>
      <div className="content table-responsive table-full-width">
        <table className="table table-hover ">
          <thead>
            <tr>
              {column.map(({ name, key }) => {
                return (
                  <th
                    onClick={() => handleSort(key)}
                    className=" font-weight-bold text-dark"
                    key={name}
                  >
                    {name}{" "}
                    {sortKey === key && (
                      <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          {orders?.items.length && (
            <tbody>
              {(sortData()?.length ? sortData() : orders?.items)?.map(
                (order, idx) => (
                  <tr className={rowColor(order.status)} key={order.id}>
                    <td className={styles.num}> {handleIdx(idx)}</td>
                    <td>{order.purchaser}</td>
                    <td>{order?.category.name}</td>
                    <td>{order.product}</td>
                    <td>{numberWithCommas(order.price)}</td>
                    <td>
                      {dayjs(order.time_created).format("DD-MMM-YYYY HH:mm")}
                    </td>
                    <td>{handleStatus(order.status)}</td>
                    {admin ? (
                      <>
                        <td className="d-flex gap-2 align-items-center">
                          <button
                            disabled={submitting}
                            onClick={handleStatusSubmit({
                              order_id: order.id,
                              status: Status.accepted,
                            })}
                            type="button"
                            className="btn btn-success"
                          >
                            Принять
                          </button>
                          <button
                            disabled={submitting}
                            onClick={handleStatusSubmit({
                              order_id: order.id,
                              status: Status.denied,
                            })}
                            type="button"
                            className="btn btn-danger"
                          >
                            Отклонить
                          </button>
                          <div className="mx-2" />
                          <div
                            className={styles.viewBtn}
                            onClick={handleNavigate(order.id)}
                          >
                            <img
                              className={styles.viewImg}
                              src="/assets/icons/view.svg"
                              alt="edit"
                            />
                          </div>
                        </td>
                      </>
                    ) : (
                      <td>
                        <div
                          className={styles.viewBtn}
                          onClick={handleNavigate(order.id)}
                        >
                          <img
                            className={styles.viewImg}
                            src="/assets/icons/view.svg"
                            alt="edit"
                          />
                        </div>
                      </td>
                    )}
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
            <p className="text-center w-100 ">Спосок пуст</p>
          </div>
        )}
      </div>
    </Container>
  );
};

export default ActiveOrders;
