import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import useQueryString from "@/hooks/custom/useQueryString";
import TableViewBtn from "@/components/TableViewBtn";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import ParentToolsFilter from "./filter";
import AntdTable from "@/components/AntdTable";
import Table, { ColumnsType } from "antd/es/table";
import { Popconfirm } from "antd";
import { getParentTools, parentToolMutation } from "@/hooks/parentTools";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import { useForm } from "react-hook-form";
import successToast from "@/utils/successToast";

const ParentTools = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigateParams = useNavigateParams();
  const { mutate, isPending } = parentToolMutation();
  const name = useQueryString("name");
  const parent_id = useQueryString("parent_id");
  const parent_name = useQueryString("parent_name");

  const { data, isLoading, isFetching, refetch } = getParentTools({
    ...(!!parent_id && { parent_id }),
    ...(!!name && { name }),
  });

  const goBack = () => navigate(-1);

  const { register, getValues } = useForm();

  const handleParentId = (id: string, name: string) => () =>
    navigateParams({ parent_id: id, parent_name: name });

  const handleStatus = (id: string) => {
    mutate(
      { id, status: Number(getValues(id)) },
      {
        onSuccess: () => {
          refetch();
          successToast("updated");
        },
      }
    );
  };

  const columns = useMemo<ColumnsType<ParentTools>>(
    () => [
      {
        render: (_, r, idx) => idx + 1,
        title: "№",
        width: 100,
      },
      {
        dataIndex: "name",
        title: t("name_in_table"),
        render: (_, record) => (
          <span
            className="cursor-pointer text-blue-400"
            onClick={handleParentId(record.id, record.name)}
          >
            {record.name}
          </span>
        ),
      },
      {
        dataIndex: "status",
        title: t("status"),
        render: (_, record) => (!record.status ? t("not_active") : t("active")),
      },
      {
        dataIndex: "action",
        width: 50,
        title: "",
        render: (_, record) => {
          return (
            <Popconfirm
              title={
                <div className="flex flex-col ">
                  Изменить статус
                  <MainCheckBox
                    label={"active"}
                    register={register(`${record.id}`)}
                    value={!!record.status}
                  />
                </div>
              }
              onConfirm={() => handleStatus(record.id)}
              okText={t("yes")}
              cancelText={t("no")}
            >
              <TableViewBtn onClick={() => null} />
            </Popconfirm>
          );
        },
      },
    ],
    []
  );

  const renderFilter = useMemo(() => {
    return <ParentToolsFilter />;
  }, []);

  return (
    <Card className="pb-4">
      <Header title={!parent_name ? "Группы товаров" : parent_name}>
        <div className="flex gap-2">
          {!!parent_id && (
            <button className="btn btn-primary" onClick={goBack}>
              {t("back")}
            </button>
          )}
        </div>
      </Header>
      <div className="content">
        <AntdTable
          sticky
          columns={columns}
          summary={() => (
            <Table.Summary fixed={"top"}>
              <Table.Summary.Row className="sticky top-0 z-10">
                {renderFilter}
              </Table.Summary.Row>
            </Table.Summary>
          )}
          data={data?.items}
          totalItems={data?.total}
          loading={isFetching || isLoading || isPending}
        />
      </div>
    </Card>
  );
};

export default ParentTools;
