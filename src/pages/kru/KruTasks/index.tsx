import AntdTable from "@/components/AntdTable";
import Card from "@/components/Card";
import Header from "@/components/Header";
import TableViewBtn from "@/components/TableViewBtn";
import useQueryString from "@/hooks/custom/useQueryString";
import { kruCategoryDeletion, useKruCategories } from "@/hooks/kru";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import { MainPermissions } from "@/utils/permissions";
import { ColumnsType } from "antd/es/table";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { DeleteOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import successToast from "@/utils/successToast.ts";

const KruTasks = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const permission = useAppSelector(permissionSelector);
  const page = Number(useQueryString("page")) || 1;

  const { data, isLoading, refetch, isFetching } = useKruCategories({ page });
  const { mutate, isPending } = kruCategoryDeletion();

  const handleNavigate = (route: string) => navigate(route);

  const handleDelete = (id: number) => {
    mutate(id, {
      onSuccess: () => {
        refetch();
        successToast("success");
      },
    });
  };

  const columns = useMemo<ColumnsType<KruCategoryRes>>(
    () => [
      {
        render: (_, r, idx) => idx + 1,
        title: "№",
        width: 50,
      },
      {
        dataIndex: "name",
        title: t("name_in_table"),
        render: (_, order) =>
          permission?.has(MainPermissions.kru_sub_tasks) ? (
            <Link to={`${order?.id}/add-task`}>{order?.name}</Link>
          ) : (
            order?.name
          ),
      },

      {
        dataIndex: "action",
        width: 50,
        title: "",
        render: (_, record) => {
          return (
            permission?.has(MainPermissions.edit_kru_tasks) && (
              <TableViewBtn onClick={() => handleNavigate(`${record.id}`)} />
            )
          );
        },
      },
      {
        dataIndex: "delete",
        width: 50,
        title: "",
        render: (_, record) => {
          return (
            permission?.has(MainPermissions.edit_kru_tasks) && (
              <Popconfirm
                title="Вы действительно хотите удалить этот отчет?"
                onConfirm={() => handleDelete(record.id)}
                // onCancel={closeModal}
                okText={t("yes")}
                cancelText={t("no")}
              >
                {/* <div
                onClick={() =>
                  navigateParams({ report_id: report.id })
                }
              > */}
                <DeleteOutlined color="red" />
                {/* </div> */}
              </Popconfirm>
            )
          );
        },
      },
    ],
    []
  );
  return (
    <Card>
      <Header title={"kru_tasks"}>
        <button onClick={() => navigate("add")} className="btn btn-success">
          {t("add")}
        </button>
      </Header>

      <div className="table-responsive  content ">
        <AntdTable
          data={data?.items}
          totalItems={data?.total}
          columns={columns}
          loading={isLoading || isFetching || isPending}
        />
      </div>
    </Card>
  );
};

export default KruTasks;
