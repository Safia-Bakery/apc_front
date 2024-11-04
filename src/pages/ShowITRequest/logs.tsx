import AntdTable from "@/components/AntdTable";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { getItrequest } from "@/hooks/it";
import { handleIdx } from "@/utils/helpers";
import { dateTimeFormat } from "@/utils/keys";
import { RequestStatus } from "@/utils/types";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

const LogsIt = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const handleNavigate = () => navigate(-1);

  const {
    data: order,
    isLoading: orderLoading,
    isFetching: orderFetching,
  } = getItrequest({ id: Number(id) });

  const columns = useMemo<ColumnsType<ItLogs>>(
    () => [
      {
        title: "№",
        dataIndex: "",
        width: 50,
        className: "!px-0 text-center",
        render: (_, r, idx) => handleIdx(idx),
      },
      {
        title: t("action"),
        dataIndex: "status",
        width: 50,
        className: "!px-0 text-center",
        render: (_, record) => t(RequestStatus[record.status]),
      },
      {
        title: t("employee"),
        dataIndex: "status",
        width: 50,
        className: "!px-0 text-center",
        render: (_, record) => record?.user?.full_name,
      },
      {
        title: t("date"),
        dataIndex: "status",
        width: 50,
        className: "!px-0 text-center",
        render: (_, record) =>
          record?.created_at?.[RequestStatus.new]
            ? dayjs(record?.created_at?.[RequestStatus.new]).format(
                dateTimeFormat
              )
            : t("not_given"),
      },
      {
        title: t("minute"),
        dataIndex: "status",
        width: 50,
        className: "!px-0 text-center",
        render: (_, record) => t(RequestStatus[record.status]),
      },
    ],
    []
  );
  return (
    <Card>
      <Header title={"logs"}>
        <button onClick={handleNavigate} className="btn btn-primary">
          {t("back")}
        </button>
      </Header>

      <AntdTable data={order?.log} loading={orderLoading} columns={columns} />
    </Card>
  );
};

export default LogsIt;
