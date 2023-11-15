import { Link, useLocation, useNavigate } from "react-router-dom";
import { Departments, MainPermissions, Order } from "src/utils/types";
import Pagination from "src/components/Pagination";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import useOrders from "src/hooks/useOrders";
import Card from "src/components/Card";
import Header from "src/components/Header";
import {
  getValue,
  handleStatus,
  itemsPerPage,
  requestRows,
  staffCategoryId,
} from "src/utils/helpers";
import TableHead from "src/components/TableHead";
import ItemsCount from "src/components/ItemsCount";
import { useAppSelector } from "src/redux/utils/types";
import { permissionSelector } from "src/redux/reducers/auth";
import useQueryString from "src/hooks/useQueryString";
import TableLoading from "src/components/TableLoading";
import BotTimeModal from "src/components/BotTimeModal";
import { useNavigateParams } from "src/hooks/useCustomNavigate";
import StaffFilter from "./filter";
import { useDownloadExcel } from "react-export-table-to-excel";

const column = [
  { name: "№", key: "" },
  { name: "Номер заявки", key: "id" },
  { name: "Клиент", key: "user" },
  { name: "Филиал", key: "name" },
  { name: "Порция еды", key: "size" },
  { name: "Порции хлеба", key: "bread_size" },
  { name: "Дата поставки", key: "arrival_date" },
  { name: "Статус", key: "status" },
];

const today = new Date();
const tomorrow = today.setDate(today.getDate() + 1);

const RequestsStaff = () => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<keyof Order>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const permission = useAppSelector(permissionSelector);
  const sphere_status = useQueryString("sphere_status");
  const currentPage = Number(useQueryString("page")) || 1;
  const { pathname, search } = useLocation();
  const navigateParams = useNavigateParams();
  const tableRef = useRef(null);
  const arrival_date = useQueryString("arrival_date");

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `Заявки на еду ${
      !!arrival_date && arrival_date !== "undefined"
        ? dayjs(arrival_date).format("MM.DD.YYYY")
        : dayjs().format("MM.DD.YYYY")
    }`,
    sheet: "staff",
  });

  const downloadAsPdf = () => onDownload();

  const user = useQueryString("user");
  const id = Number(useQueryString("id"));
  const system = useQueryString("system");
  const department = useQueryString("department");
  const category_id = Number(useQueryString("category_id"));
  const urgent = useQueryString("urgent");
  const request_status = useQueryString("request_status");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  const handleSort = (key: any) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  const {
    data: requests,
    isLoading: orderLoading,
    refetch,
  } = useOrders({
    enabled: true,
    page: currentPage,
    arrival_date: dayjs(!!arrival_date ? arrival_date : tomorrow).format(
      "YYYY-MM-DD"
    ),
    category_id: staffCategoryId,
    ...(!!sphere_status && { sphere_status: Number(sphere_status) }),
    ...(!!system && { is_bot: !!system }),
    body: {
      ...(!!id && { id }),
      ...(!!department && { department }),
      ...(!!branch?.id && { fillial_id: branch?.id }),
      ...(!!category_id && { category_id }),
      ...(!!request_status && { request_status }),
      ...(!!user && { user: user }),
      ...(!!urgent && { urgent }),
    },
  });

  const sortData = () => {
    if (requests?.items && sortKey) {
      const sortedData = [...requests.items].sort((a, b) => {
        const valueA = getValue(a, sortKey);
        const valueB = getValue(b, sortKey);

        if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
        if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
      return sortedData;
    }
  };

  const handleIdx = (index: number) => {
    if (currentPage === 1) return index + 1;
    else return index + 1 + itemsPerPage * (currentPage - 1);
  };

  useEffect(() => {
    refetch();
  }, [currentPage, sphere_status]);

  const renderProductCount = useMemo(() => {
    return requests?.items.reduce(
      (acc, item) => acc + (!isNaN(+item.size) ? Number(item.size) : 0),
      0
    );
  }, [requests]);

  const renderBreadCount = useMemo(() => {
    return requests?.items.reduce(
      (acc, item) =>
        acc + (!isNaN(+item.bread_size!) ? Number(item.bread_size) : 0),
      0
    );
  }, [requests]);

  return (
    <Card>
      <Header title={"Заявки"}>
        <div className="flex gap-2">
          <div className="p-2 btn btn-warning flex flex-col justify-between">
            <h4>Количество еды</h4>
            <h2 className={"flex text-3xl justify-end"}>
              {renderProductCount}
            </h2>
          </div>
          <div className="p-2 btn btn-primary flex flex-col justify-between">
            <h4>Количество хлеба</h4>
            <h2 className={"flex text-3xl justify-end"}>{renderBreadCount}</h2>
          </div>
          <div className="flex flex-col gap-2 justify-between">
            <button
              className="btn btn-success btn-fill"
              onClick={downloadAsPdf}
            >
              Экспорт в Excel
            </button>
            {permission?.[MainPermissions.staff_modal_time] && (
              <button
                onClick={() => navigateParams({ time_modal: 1 })}
                className="btn btn-primary btn-fill"
              >
                Настройки бота
              </button>
            )}
            {permission?.[MainPermissions.add_staff_requests] && (
              <button
                onClick={() => navigate("add")}
                className="btn btn-success btn-fill"
                id="add_request"
              >
                Добавить
              </button>
            )}
          </div>
        </div>
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={requests} />
        <table className="table table-hover" ref={tableRef}>
          <TableHead
            column={column}
            sort={handleSort}
            sortKey={sortKey}
            sortOrder={sortOrder}
          >
            <StaffFilter />
          </TableHead>
          <tbody id="requests_body">
            {!!requests?.items?.length &&
              !orderLoading &&
              (sortData()?.length ? sortData() : requests?.items)?.map(
                (order, idx) => (
                  <tr className={requestRows(order?.status)} key={idx}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td width="80">
                      {permission?.[MainPermissions.edit_staff_requests] ? (
                        <Link
                          id="request_id"
                          to={`/requests-staff/${order?.id}`}
                          state={{ prevPath: pathname + search }}
                        >
                          {order?.id}
                        </Link>
                      ) : (
                        <span className={"text-link"}>{order?.id}</span>
                      )}
                    </td>
                    <td>{order?.user?.full_name}</td>
                    <td>
                      <span className={"not-set"}>
                        {order?.fillial?.parentfillial?.name}
                      </span>
                    </td>
                    <td>{order?.size}</td>
                    <td>{order?.bread_size}</td>
                    <td>{dayjs(order?.arrival_date).format("DD.MM.YYYY")}</td>
                    <td>
                      {handleStatus({
                        status: order?.status,
                        dep: Departments.apc,
                      })}
                    </td>
                  </tr>
                )
              )}
            {orderLoading && <TableLoading />}
          </tbody>
        </table>
        {!!requests && <Pagination totalPages={requests.pages} />}
        {!requests?.items?.length && !orderLoading && (
          <div className="w-full">
            <p className="text-center w-full">Спосок пуст</p>
          </div>
        )}
      </div>
      <BotTimeModal />
    </Card>
  );
};

export default RequestsStaff;
