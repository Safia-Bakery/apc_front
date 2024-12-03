import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MainPermissions } from "@/utils/permissions";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { handleIdx, numberWithCommas, requestRows } from "@/utils/helpers";
import AntdTable from "@/components/AntdTable";
import { ColumnsType } from "antd/es/table";
import useQueryString from "@/hooks/custom/useQueryString";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "@/store/reducers/sidebar";
import TableViewBtn from "@/components/TableViewBtn";
import { getCoins } from "@/hooks/coins";
import dayjs from "dayjs";
import { dateMonthYear } from "@/utils/keys";
import { RequestStatus } from "@/utils/types";
import Loading from "@/components/Loader";

const CoinRequests = () => {
  const { t } = useTranslation();
  const page = Number(useQueryString("page")) || 1;
  const navigate = useNavigate();
  const permission = useAppSelector(permissionSelector);

  const { data, isLoading, refetch, isFetching } = getCoins({ page });

  const columns = useMemo<ColumnsType<CoinRes>>(
    () => [
      {
        title: "№",
        dataIndex: "",
        width: 50,
        className: "!px-0 text-center",
        render: (_, r, idx) => handleIdx(idx),
      },
      {
        title: t("branch"),
        dataIndex: "fillial_id",
        render: (_, record) => record?.fillial?.parentfillial?.name,
      },
      {
        title: t("user"),
        dataIndex: "user_id",
        render: (_, record) => record?.user?.full_name,
      },
      {
        title: t("summ"),
        dataIndex: "amount",
        render: (_, record) => numberWithCommas(record?.amount),
      },
      {
        title: t("created_at"),
        dataIndex: "created_at",
        render: (_, record) => dayjs(record.created_at).format(dateMonthYear),
      },
      {
        title: t("status"),
        dataIndex: "status",
        render: (_, record) => t(RequestStatus[record?.status]),
      },
      {
        title: "",
        width: 50,
        render: (_, record) => {
          return (
            permission?.[MainPermissions.edit_coin_request] && (
              <TableViewBtn onClick={() => navigate(`${record.id}`)} />
            )
          );
        },
      },
    ],
    []
  );

  if (isLoading || isFetching) return <Loading />;

  return (
    <Card>
      <Header title={"coins"}>
        <button onClick={() => refetch()} className="btn btn-primary ml-2">
          {t("refresh")}
        </button>
      </Header>

      <div className="overflow-x-auto md:overflow-visible content">
        <AntdTable
          sticky
          data={data?.items}
          rowClassName={(item) => requestRows[item?.status]}
          totalItems={data?.total}
          columns={columns}
          loading={isLoading}
        />
      </div>
    </Card>
  );
};

export default CoinRequests;
