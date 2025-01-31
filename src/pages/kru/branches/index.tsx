import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { BranchType } from "@/utils/types";
import TableViewBtn from "@/components/TableViewBtn";
import useBranches from "@/hooks/useBranches";
import BranchesFilter from "./filter";
import useQueryString from "custom/useQueryString";
import { useTranslation } from "react-i18next";
import AntdTable from "@/components/AntdTable";
import Table, { ColumnsType } from "antd/es/table";

const KruBranches = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentPage = Number(useQueryString("page")) || 1;
  const fillial_status = useQueryString("fillial_status");
  const country = useQueryString("country");
  const name = useQueryString("name");

  const columns = useMemo<ColumnsType<BranchType>>(
    () => [
      {
        render: (_, r, idx) => idx + 1,
        title: "№",
        width: 80,
      },
      {
        dataIndex: "name",
        title: t("name_in_table"),
      },
      {
        dataIndex: "status",
        title: t("status"),
        render: (_, row) => (!row.status ? t("not_active") : t("active")),
      },
      {
        dataIndex: "action",
        width: 80,
        title: "",
        render: (_, row) => {
          return <TableViewBtn onClick={handleNavigate(`${row.id}`)} />;
        },
      },
    ],
    []
  );

  const {
    data: branches,
    isFetching,
    isLoading,
  } = useBranches({
    page: currentPage,
    enabled: true,
    origin: 0,
    body: {
      ...(!!name && { name }),
      ...(!!country && { country }),
      ...(!!fillial_status && { fillial_status }),
    },
  });

  const handleNavigate = (route: string) => () => navigate(route);

  const renderFilter = useMemo(() => {
    return <BranchesFilter />;
  }, [name, country, fillial_status]);

  return (
    <Card>
      <Header title={"branches"} />

      <div className="table-responsive content">
        <AntdTable
          sticky
          data={branches?.items}
          columns={columns}
          loading={isFetching || isLoading}
          totalItems={branches?.total}
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

export default KruBranches;
