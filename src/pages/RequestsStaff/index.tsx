import { Link, useLocation, useNavigate } from "react-router-dom";
import { MainPermissions, Order, RequestStatus } from "@/utils/types";
import Pagination from "@/components/Pagination";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, requestRows } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import ItemsCount from "@/components/ItemsCount";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import BotTimeModal from "@/components/BotTimeModal";
import { useNavigateParams } from "custom/useCustomNavigate";
import StaffFilter from "./filter";
import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";
import useStaffExcell from "@/hooks/useStaffExcell";
import { baseURL } from "@/main";
import { dateMonthYear, staffCategoryId, yearMonthDate } from "@/utils/keys";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№", key: "" },
  { name: "request_number", key: "id" },
  { name: "client", key: "user" },
  { name: "branch", key: "name" },
  { name: "food_portion", key: "size" },
  { name: "bread_portion", key: "bread_size" },
  { name: "delivery_date", key: "arrival_date" },
  { name: "status", key: "status" },
];

const today = new Date();
const tomorrow = today.setDate(today.getDate() + 1);

const RequestsStaff = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sort, $sort] = useState<Order[]>();
  const [excelFile, $excelFile] = useState(false);
  const permission = useAppSelector(permissionSelector);
  const sphere_status = useQueryString("sphere_status");
  const currentPage = Number(useQueryString("page")) || 1;
  const { pathname, search } = useLocation();
  const navigateParams = useNavigateParams();
  const tableRef = useRef(null);
  const arrival_date = useQueryString("arrival_date");

  const user = useQueryString("user");
  const id = Number(useQueryString("id"));
  const bread = useQueryString("bread");
  const portion = useQueryString("portion");
  const request_status = useQueryString("request_status");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  const {
    data: totals,
    isFetching: excellFtching,
    isLoading: excellLoading,
  } = useStaffExcell({
    date: dayjs(!!arrival_date ? arrival_date : tomorrow).format(yearMonthDate),
    file: excelFile,
  });

  const {
    data: requests,
    isLoading,
    isFetching,
  } = useOrders({
    enabled: true,
    page: currentPage,
    arrival_date: dayjs(!!arrival_date ? arrival_date : tomorrow).format(
      yearMonthDate
    ),
    category_id: staffCategoryId,
    ...(!!sphere_status && { sphere_status: Number(sphere_status) }),
    ...(!!id && { id }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!request_status && { request_status }),
    ...(!!user && { user }),
    ...(!!bread && { bread }),
    ...(!!portion && { portion }),
  });

  useEffect(() => {
    if (excelFile && totals?.url) {
      const url = `${baseURL}/${totals.url}`;
      const a = document.createElement("a");
      a.href = url;
      document.body.appendChild(a);
      a.click();

      $excelFile(false);
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [excelFile, totals?.url]);

  const handleExcell = () => $excelFile(true);

  const renderFilter = useMemo(() => {
    return <StaffFilter />;
  }, []);

  const renderModal = useMemo(() => {
    return <BotTimeModal />;
  }, []);

  if (excellLoading) return <Loading />;

  return (
    <Card>
      <Header title={t("requests")}>
        <div className="flex gap-2">
          <div className="p-2 btn btn-warning flex flex-col justify-between">
            <h4>{t("food_qnt")}</h4>
            <h2 className={"flex text-3xl justify-end"}>
              {totals?.total_food}
            </h2>
          </div>
          <div className="p-2 btn btn-primary flex flex-col justify-between">
            <h4>{t("bread_qnt")}</h4>
            <h2 className={"flex text-3xl justify-end"}>
              {totals?.total_bread}
            </h2>
          </div>
          <div className="flex flex-col gap-2 justify-between">
            <button className="btn btn-success  " onClick={handleExcell}>
              {t("export_to_excel")}
            </button>
            {permission?.[MainPermissions.staff_modal_time] && (
              <button
                onClick={() => navigateParams({ time_modal: 1 })}
                className="btn btn-primary  "
              >
                {t("bot_settings")}
              </button>
            )}
            {permission?.[MainPermissions.add_staff_requests] && (
              <button
                onClick={() => navigate("add")}
                className="btn btn-success  "
                id="add_request"
              >
                {t("add")}
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
            {renderFilter}
          </TableHead>
          <tbody id="requests_body">
            {!!requests?.items?.length &&
              !isLoading &&
              (sort?.length ? sort : requests?.items)?.map((order, idx) => (
                <tr className={requestRows[order?.status]} key={idx}>
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
                  <td>{dayjs(order?.arrival_date).format(dateMonthYear)}</td>
                  <td>{t(RequestStatus[order.status])}</td>
                </tr>
              ))}
          </tbody>
        </table>
        {(isFetching || excellFtching) && <Loading />}
        {!requests?.items?.length && !isLoading && <EmptyList />}
        {!!requests && <Pagination totalPages={requests.pages} />}
      </div>
      {renderModal}
    </Card>
  );
};

export default RequestsStaff;
