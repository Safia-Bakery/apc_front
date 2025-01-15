import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MainPermissions } from "@/utils/permissions";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx } from "@/utils/helpers";
import AntdTable from "@/components/AntdTable";
import { ColumnsType } from "antd/es/table";

import { getApcFactoryDivisions } from "@/hooks/factory";
import { DivisionRes } from "@/Types/factory";
import useQueryString from "@/hooks/custom/useQueryString";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "@/store/reducers/sidebar";
import TableViewBtn from "@/components/TableViewBtn";

const ManagersFabric = () => {
  const { t } = useTranslation();
  const page = Number(useQueryString("page")) || 1;
  const navigate = useNavigate();
  const permission = useAppSelector(permissionSelector);

  const { data, isLoading } = getApcFactoryDivisions({ page });

  const columns = useMemo<ColumnsType<DivisionRes>>(
    () => [
      {
        title: "№",
        dataIndex: "",
        width: 50,
        className: "!px-0 text-center",
        render: (_, r, idx) => handleIdx(idx),
      },
      {
        title: t("name_in_table"),
        dataIndex: "name",
      },
      {
        title: t("master"),
        dataIndex: "master_name",
        render: (_, record) => record?.manager?.name,
      },
      {
        title: t("status"),
        dataIndex: "status",
        render: (_, record) => (record?.status ? t("active") : t("not_active")),
      },
      {
        title: "",
        width: 50,
        render: (_, record) => {
          return (
            permission?.has(MainPermissions.update_apc_fabric_division) && (
              <TableViewBtn onClick={() => navigate(`${record.id}`)} />
            )
          );
        },
      },
    ],
    []
  );

  return (
    <Card>
      <Header title={"branch_dep"}>
        <button
          onClick={() => navigate("add")}
          className="btn btn-success ml-2"
        >
          {t("add")}
        </button>
      </Header>

      <div className="overflow-x-auto md:overflow-visible content">
        <AntdTable
          sticky
          data={data?.items}
          totalItems={data?.total}
          columns={columns}
          loading={isLoading}
        />
      </div>
    </Card>
  );
};

export default ManagersFabric;
