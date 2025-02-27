import Card from "@/components/Card";
import Header from "@/components/Header";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UsersType } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import { FC, useMemo } from "react";
import { handleIdx } from "@/utils/helpers";
import TableViewBtn from "@/components/TableViewBtn";
import useUsers from "@/hooks/useUsers";
import UsersFilter from "./filter";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import useQueryString from "custom/useQueryString";
import { useTranslation } from "react-i18next";
import Table, { ColumnsType } from "antd/es/table";
import AntdTable from "@/components/AntdTable";

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
  const { data: users, isLoading: usersLoading } = useUsers({
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

  const columns = useMemo<ColumnsType<UsersType>>(
    () => [
      {
        title: "№",
        dataIndex: "",
        width: 50,
        className: "!px-0 text-center",
        render: (_, r, idx) => handleIdx(idx),
      },
      {
        title: t("full_name"),
        dataIndex: "full_name",
      },
      {
        title: t("login"),
        dataIndex: "username",
      },
      {
        title: t("role"),
        dataIndex: "brigada",

        render: (_, record) => (
          <Link
            to={
              permission?.has(MainPermissions.edit_roles)
                ? `/roles/${record?.group?.id}`
                : pathname
            }
          >
            {record.group?.name}
          </Link>
        ),
      },
      {
        title: t("phone"),
        dataIndex: "phone_number",
      },
      {
        title: t("status"),
        dataIndex: "status",
        render: (_, record) => userStatus(record?.status),
      },
      {
        title: "",

        width: 50,
        dataIndex: "action",
        render: (_, record) =>
          permission?.has(edit) && (
            <TableViewBtn onClick={handleNavigate(`${record?.id}`)} />
          ),
      },
    ],
    [edit, permission]
  );

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
        {permission?.has(add) && (
          <button className="btn btn-success" onClick={handleNavigate("add")}>
            {t("add")}
          </button>
        )}
      </Header>

      <div className="table-responsive  content">
        <AntdTable
          sticky
          data={users?.items}
          totalItems={users?.total}
          columns={columns}
          loading={usersLoading}
          summary={() => (
            <Table.Summary fixed={"top"}>
              <Table.Summary.Row className="sticky top-0 z-10">
                {renderFilter}
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </div>
    </Card>
  );
};

export default Users;
