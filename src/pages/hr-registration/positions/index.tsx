import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MainPermissions } from "@/utils/permissions";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, isMobile } from "@/utils/helpers";

import AntdTable from "@/components/AntdTable";
import { ColumnsType } from "antd/es/table";
import { permissionSelector } from "@/store/reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";

import { getPositions } from "@/hooks/hr-registration";
import TableViewBtn from "@/components/TableViewBtn";

const HrPositions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const permission = useAppSelector(permissionSelector);

  const columns = useMemo<ColumnsType<HRPositions>>(
    () => [
      {
        title: "№",
        dataIndex: "",
        width: 60,
        className: "!px-0 text-center",
        render: (_, r, idx) => handleIdx(idx),
      },
      {
        title: t("name_in_table"),
        dataIndex: "name",
      },

      {
        title: t("status"),
        dataIndex: "status",
        ...(isMobile && { width: 150 }),
        render: (_, record) =>
          !!record.status ? t("active") : t("not_active"),
      },
      {
        width: 50,
        title: "",
        dataIndex: "action",
        render: (_, record) =>
          permission?.has(MainPermissions.edit_hr_position) && (
            <TableViewBtn onClick={() => navigate(`${record.id}`)} />
          ),
      },
    ],
    []
  );

  const {
    data,
    isLoading: orderLoading,
    isFetching: orderFetching,
    isRefetching,
    refetch,
  } = getPositions({});

  return (
    <Card>
      <Header title={"positions"}>
        <button className="btn btn-primary" onClick={() => refetch()}>
          {t("refresh")}
        </button>
        {permission?.has(MainPermissions.edit_hr_position) && (
          <button
            className="btn btn-primary ml-3"
            onClick={() => navigate("add")}
          >
            {t("add")}
          </button>
        )}
      </Header>

      <div className="overflow-x-auto md:overflow-visible content">
        <AntdTable
          sticky
          data={data}
          columns={columns}
          loading={orderLoading || orderFetching || isRefetching}
        />
      </div>
    </Card>
  );
};

export default HrPositions;
