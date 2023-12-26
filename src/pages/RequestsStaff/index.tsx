import { Link, useLocation, useNavigate } from "react-router-dom";
import { Departments, MainPermissions, Order } from "@/utils/types";
import Pagination from "@/components/Pagination";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import Header from "@/components/Header";
import {
  handleIdx,
  handleStatus,
  requestRows,
  staffCategoryId,
} from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import ItemsCount from "@/components/ItemsCount";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import TableLoading from "@/components/TableLoading";
import BotTimeModal from "@/components/BotTimeModal";
import { useNavigateParams } from "custom/useCustomNavigate";
import StaffFilter from "./filter";
import { useDownloadExcel } from "react-export-table-to-excel";
import EmptyList from "@/components/EmptyList";

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
  const [sort, $sort] = useState<Order[]>();
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
  const request_status = useQueryString("request_status");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

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
    ...(!!id && { id }),
    ...(!!department && { department }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!category_id && { category_id }),
    ...(!!request_status && { request_status }),
    ...(!!user && { user: user }),
  });

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
            onSort={(data) => $sort(data)}
            data={requests?.items}
          >
            <StaffFilter />
          </TableHead>
          <tbody id="requests_body">
            {!!requests?.items?.length &&
              !orderLoading &&
              (sort?.length ? sort : requests?.items)?.map((order, idx) => (
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
              ))}
            {orderLoading && <TableLoading />}
          </tbody>
        </table>
        {!!requests && <Pagination totalPages={requests.pages} />}
        {!requests?.items?.length && !orderLoading && <EmptyList />}
      </div>
      <BotTimeModal />
    </Card>
  );
};

export default RequestsStaff;
