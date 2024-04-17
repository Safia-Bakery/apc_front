import { Link, useNavigate } from "react-router-dom";
import { Departments, MainPermissions, Order } from "@/utils/types";
import Pagination from "@/components/Pagination";
import { FC, useState } from "react";
import dayjs from "dayjs";
import useOrders from "@/hooks/useOrders";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { MarketingStatusObj, handleIdx, requestRows } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import MarketingFilter from "./filter";
import ItemsCount from "@/components/ItemsCount";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import { dateTimeFormat, yearMonthDate } from "@/utils/keys";

const column = [
  { name: "№", key: "" },
  { name: "request_number", key: "id" },
  { name: "person_name", key: "person_name" },
  { name: "phone_number", key: "fillial.name" },
  { name: "subcategory", key: "fillial.name" },
  { name: "branch", key: "fillial.name" },
  { name: "issue_date", key: "fillial.name" },
  { name: "rate", key: "rate" },
  { name: "status", key: "status" },
  { name: "changed", key: "category.name" },
];

interface Props {
  title: string;
  sub_id?: number;
  add?: MainPermissions;
  edit?: MainPermissions;
}

const RequestsMarketing: FC<Props> = ({ title, sub_id, add, edit }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sort, $sort] = useState<Order[]>();
  const permission = useAppSelector(permissionSelector);
  const currentPage = Number(useQueryString("page")) || 1;

  const request_status = useQueryString("request_status");
  const category_id = Number(useQueryString("category_id"));
  const created_at = useQueryString("created_at");
  const id = useQueryString("id");
  const phone = useQueryString("phone");
  const user = useQueryString("user");
  const rate = useQueryString("rate");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  console.log(MarketingStatusObj, "MarketingStatusObj");

  const {
    data: requests,
    isLoading: orderLoading,
    isFetching: orderFetching,
  } = useOrders({
    department: Departments.marketing,
    page: currentPage,
    sub_id,

    ...(!!created_at && {
      created_at: dayjs(created_at).format(yearMonthDate),
    }),
    ...(!!id && { id }),
    ...(!!phone && { executor: phone }),
    ...(!!branch?.id && { fillial_id: branch?.id }),
    ...(!!category_id && { category_id }),
    ...(!!request_status && { request_status }),
    ...(!!user && { user }),
    ...(!!rate && { rate: !!rate }),
  });

  return (
    <Card className="overflow-hidden">
      <Header title={title?.toString()}>
        {add && permission?.[add] && (
          <button
            onClick={() => navigate(`add?sub_id=${sub_id}`)}
            className="btn btn-success  "
            id="add_request"
          >
            {t("add")}
          </button>
        )}
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={requests} />
        <table className="table table-hover">
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={requests?.items}
          >
            <MarketingFilter sub_id={sub_id} />
          </TableHead>

          <tbody>
            {!!requests?.items?.length &&
              !orderLoading &&
              (sort?.length ? sort : requests?.items)?.map((order, idx) => (
                <tr className={requestRows[order.status]} key={idx}>
                  <td width="40">{handleIdx(idx)}</td>
                  <td width="80">
                    {edit && permission?.[edit] ? (
                      <Link to={`${order?.id}?sub_id=${sub_id}&edit=${edit}`}>
                        {order?.id}
                      </Link>
                    ) : (
                      <span className={"text-link"}>{order?.id}</span>
                    )}
                  </td>
                  <td>
                    <span className="not-set">{order?.user?.full_name}</span>
                  </td>
                  <td>{order?.user?.phone_number}</td>
                  <td>{order?.category?.name}</td>
                  <td>{order?.fillial?.parentfillial?.name}</td>
                  <td>{dayjs(order?.created_at).format(dateTimeFormat)}</td>
                  <td>{order?.comments?.[0]?.rating}</td>
                  <td>
                    {order.status.toString() &&
                      t(MarketingStatusObj[order.status])}
                  </td>
                  <td>
                    {order?.user_manager ? order?.user_manager : t("not_given")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {(orderLoading || orderFetching) && <Loading />}
        {!requests?.items?.length && !orderLoading && <EmptyList />}
        {!!requests && <Pagination totalPages={requests.pages} />}
      </div>
    </Card>
  );
};

export default RequestsMarketing;
