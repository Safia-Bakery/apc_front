import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import UsersFilter from "./filter";
import Table, { ColumnsType } from "antd/es/table";
import { handleIdx } from "@/utils/helpers";
import AntdTable from "@/components/AntdTable";
import { MainPermissions } from "@/utils/types";
import { Link, useNavigate } from "react-router-dom";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import useUsers from "@/hooks/useUsers";
import Header from "@/components/Header";
import Card from "@/components/Card";

const KRURequests = () => {
  const { t } = useTranslation();
  const permission = useAppSelector(permissionSelector);
  const navigate = useNavigate();
  const handleNavigate = (route: string) => () => navigate(route);
  const { data: users, isLoading: usersLoading } = useUsers({});
  const columns = useMemo<ColumnsType<any>>(
    () => [
      {
        title: "№",
        dataIndex: "",
        width: 50,
        className: "!px-0 text-center",
        render: (_, r, idx) => handleIdx(idx),
      },
      {
        title: t("num"),
        dataIndex: "id",
        width: 100,
        render: (_, order) =>
          permission?.[MainPermissions.edit_it_requests] ? (
            <Link to={`${order?.id}`}>{order?.id}</Link>
          ) : (
            order?.id
          ),
      },
      {
        title: t("name_in_table"),
        dataIndex: "full_name",
      },
      {
        title: t("subtask_qnt"),
        dataIndex: "username",
        render: (_, record) => record?.full_name,
      },
    ],
    [permission]
  );

  const renderFilter = useMemo(() => {
    return <UsersFilter />;
  }, []);

  return (
    <Card>
      <Header title={"tasks"}>
        {permission?.[MainPermissions.add_kru_requests] && (
          <button className="btn btn-success" onClick={handleNavigate("add")}>
            {t("add")}
          </button>
        )}
      </Header>

      <div className="table-responsive grid-view content">
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

export default KRURequests;
