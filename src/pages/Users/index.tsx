import Card from "@/components/Card";
import Header from "@/components/Header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MainPermissions, UsersType } from "@/utils/types";
import Pagination from "@/components/Pagination";
import { FC, useMemo, useState } from "react";
import { handleIdx } from "@/utils/helpers";
import TableHead from "@/components/TableHead";
import TableViewBtn from "@/components/TableViewBtn";
import useUsers from "@/hooks/useUsers";
import UsersFilter from "./filter";
import ItemsCount from "@/components/ItemsCount";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import EmptyList from "@/components/EmptyList";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";

const column = [
  { name: "№", key: "" },
  { name: "ФИО", key: "full_name" },
  { name: "Логин", key: "username" },
  { name: "Роль", key: "group.name" },
  { name: "Телефон", key: "phone_number" },
  { name: "status", key: "status" },
  { name: "", key: "" },
];

interface Props {
  add: MainPermissions;
  edit: MainPermissions;
}

const Users: FC<Props> = ({ add, edit }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleNavigate = (route: string) => () => navigate(route);
  const { pathname } = useLocation();
  const permission = useAppSelector(permissionSelector);
  const client = useQueryString("client");
  const currentPage = Number(useQueryString("page")) || 1;
  const user_status = useQueryString("user_status");
  const full_name = useQueryString("full_name");
  const role_id = useQueryString("role_id");
  const username = useQueryString("username");
  const phone_number = useQueryString("phone_number");
  const [sort, $sort] = useState<UsersType[]>();
  const { data: users, isLoading: orderLoading } = useUsers({
    page: currentPage,
    body: {
      ...(!!full_name && { full_name }),
      ...(!!user_status && { user_status }),
      ...(!!role_id && { role_id }),
      ...(!!username && { username }),
      ...(!!phone_number && { phone_number }),
    },
    ...(!!client && { position: false }),
  });

  const userStatus = (item: number) => {
    if (item === 1) return "суперадмин";
    if (item === 2) return t("not_active");
    if (item === 0) return t("active");
  };

  const renderFilter = useMemo(() => {
    return <UsersFilter currentPage={currentPage} />;
  }, [full_name, user_status, role_id, username, phone_number]);

  return (
    <Card>
      <Header title={!client ? "users" : "client"}>
        {permission?.[add] && (
          <button className="btn btn-success  " onClick={handleNavigate("add")}>
            {t("add")}
          </button>
        )}
      </Header>

      <div className="table-responsive grid-view content">
        <ItemsCount data={users} />
        <table className="table table-hover">
          <TableHead
            column={column}
            onSort={(data) => $sort(data)}
            data={users?.items}
          >
            {renderFilter}
          </TableHead>

          <tbody>
            {!!users?.items?.length &&
              !orderLoading &&
              (sort?.length ? sort : users?.items)
                ?.filter((user) => user.status !== 1)
                .map((user, idx) => (
                  <tr className="bg-blue" key={idx}>
                    <td width="40">{handleIdx(idx)}</td>
                    <td>{user.full_name}</td>
                    <td>
                      <span className="not-set">{user?.username}</span>
                    </td>
                    <td width={250}>
                      <Link
                        to={
                          permission?.[MainPermissions.edit_roles]
                            ? `/roles/${user?.group?.id}`
                            : pathname
                        }
                      >
                        {user.group?.name}
                      </Link>
                    </td>
                    <td>{user?.phone_number}</td>
                    <td>{userStatus(user?.status)}</td>
                    <td width={40}>
                      {permission?.[edit] && (
                        <TableViewBtn onClick={handleNavigate(`${user?.id}`)} />
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
        {orderLoading && <Loading />}
        {!users?.items?.length && !orderLoading && <EmptyList />}
        {!!users && <Pagination totalPages={users.pages} />}
      </div>
    </Card>
  );
};

export default Users;
