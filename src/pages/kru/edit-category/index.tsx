import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  editAddKruCategoryMutation,
  kruCategoryDeletion,
  useKruCategories,
  useKruCategory,
} from "@/hooks/kru.ts";
import { DeleteOutlined } from "@ant-design/icons";
import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loader";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput.tsx";
import { useForm } from "react-hook-form";
import successToast from "@/utils/successToast.ts";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import dayjs, { Dayjs } from "dayjs";
import { Flex, Popconfirm, TimePicker } from "antd";
import MainSelect from "@/components/BaseInputs/MainSelect";
import { permissionSelector } from "@/store/reducers/sidebar";
import TableViewBtn from "@/components/TableViewBtn";
import useQueryString from "@/hooks/custom/useQueryString";
import { useAppSelector } from "@/store/utils/types";
import { MainPermissions } from "@/utils/permissions";
import { ColumnsType } from "antd/es/table";
import AntdTable from "@/components/AntdTable";

const EditKruCategory = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const page = Number(useQueryString("page")) || 1;
  const navigate = useNavigate();
  const { mutate, isPending } = editAddKruCategoryMutation();
  const { data: categories, isLoading: categoriesLoading } = useKruCategories({
    page,
    enabled: !!id,
  });
  const {
    data: categoriesChild,
    isLoading: categoriesChildLoading,
    refetch: refetchChild,
  } = useKruCategories({
    page,
    parent: Number(id),
    enabled: !!id,
  });
  const { refetch } = useKruCategories({ page: 1, enabled: false });
  const [start_time, $start_time] = useState<Dayjs | null>();
  const [end_time, $end_time] = useState<Dayjs | null>();

  const permission = useAppSelector(permissionSelector);

  const { mutate: taskDelete, isPending: deleting } = kruCategoryDeletion();

  const handleNavigate = (route: string) => navigate(route);

  const handleDelete = (id: number) => {
    taskDelete(id, {
      onSuccess: () => {
        refetch();
        successToast("success");
      },
    });
  };

  const handleStartTime = (time: Dayjs | null) => {
    $start_time(time);
  };

  const handleEndTime = (time: Dayjs | null) => {
    $end_time(time);
  };

  const {
    register,
    reset,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    data: category,
    isLoading,
    refetch: categoryrefetch,
  } = useKruCategory({
    id: Number(id),
    enabled: !!id,
  });

  const onSubmit = () => {
    const { name, parent, description } = getValues();
    mutate(
      {
        name,
        parent: !parent ? null : parent,
        description,
        ...(!!id && { id: Number(id) }),
        ...(!!start_time && { start_time: start_time?.format("HH:mm") }),
        ...(!!end_time && { end_time: end_time?.format("HH:mm") }),
      },
      {
        onSuccess: () => {
          refetch();
          if (!!id) {
            categoryrefetch();
          }
          successToast("success");
          navigate("/kru-tasks");
        },
      }
    );
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
            <Link to={`/kru-tasks/${order?.id}/add-task`}>{order?.name}</Link>
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
              <TableViewBtn
                onClick={() => handleNavigate(`/kru-tasks/${record.id}`)}
              />
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

  useEffect(() => {
    if (category && !!id && categories?.items?.length) {
      if (!!category.end_time) $end_time(dayjs(category.end_time, "HH:mm"));
      if (!!category.start_time)
        $start_time(dayjs(category.start_time, "HH:mm"));
      reset({
        name: category?.name,
        description: category.description,
        parent: category.parent,
      });
    }
  }, [category, id, categories]);

  if (isLoading || isPending || categoriesLoading) return <Loading />;

  return (
    <Card className="!h-min">
      <Header title={!id ? t("add") : `${t("edit_category")} №${id}`}>
        <button onClick={() => navigate(-1)} className="btn btn-primary">
          {t("back")}
        </button>
      </Header>

      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <Flex gap={20}>
          <Flex flex={1} vertical>
            <BaseInputs label={"name_in_table"} error={errors?.name}>
              <MainInput
                placeholder={t("name_in_table")}
                register={register("name", { required: t("required_field") })}
              />
            </BaseInputs>
            <BaseInputs label={"parent"}>
              <MainSelect
                values={categories?.items}
                register={register("parent")}
              />
            </BaseInputs>
            <BaseInputs label={"description"}>
              <MainTextArea
                placeholder={t("description")}
                register={register("description")}
              />
            </BaseInputs>
          </Flex>
          <Flex flex={1} vertical>
            <BaseInputs label={"start_time"}>
              <TimePicker
                className="flex"
                value={start_time}
                onChange={handleStartTime}
                format="HH:mm"
              />
            </BaseInputs>
            <BaseInputs label={"end_time"}>
              <TimePicker
                className="flex"
                value={end_time}
                onChange={handleEndTime}
                format="HH:mm"
              />
            </BaseInputs>
          </Flex>
        </Flex>

        <button type={"submit"} className="btn btn-success">
          {t("send")}
        </button>
      </form>

      <div className="table-responsive content">
        <Flex justify="space-between" align="center">
          <h1>{t("subcategories")}</h1>

          <button className="btn btn-primary" onClick={() => refetchChild()}>
            {t("refresh")}
          </button>
        </Flex>
        <AntdTable
          data={categoriesChild?.items}
          totalItems={categoriesChild?.total}
          columns={columns}
          loading={
            isLoading ||
            categoriesLoading ||
            categoriesChildLoading ||
            isPending
          }
        />
      </div>
    </Card>
  );
};

export default EditKruCategory;
