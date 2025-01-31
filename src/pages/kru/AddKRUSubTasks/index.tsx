import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import { useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";
import BaseInputs from "@/components/BaseInputs";
import Loading from "@/components/Loader";
import errorToast from "@/utils/errorToast";
import { handleIdx, isMobile } from "@/utils/helpers";
import successToast from "@/utils/successToast";
import Card from "@/components/Card";
import Header from "@/components/Header";
import MainInput from "@/components/BaseInputs/MainInput";
import {
  editAddKruTaskMutation,
  kruTaskDeletion,
  useKruCategory,
  useKruTasks,
} from "@/hooks/kru";
import AntdTable from "@/components/AntdTable";
import { ColumnsType } from "antd/es/table/interface";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Flex, Modal, Popconfirm, Select } from "antd";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "@/store/reducers/sidebar";
import { MainPermissions } from "@/utils/permissions";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import { ValueLabel } from "@/utils/types";

const AddKRUSubTasks = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const perm = useAppSelector(permissionSelector);

  const handleDelete = (id: number) => {
    deleteTask(id, {
      onSuccess: () => {
        refetch();
        successToast("success");
      },
    });
  };

  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useForm();

  const { data: category, isLoading } = useKruCategory({ id: Number(id) });
  const {
    data: tasks,
    isLoading: taskLoading,
    refetch,
  } = useKruTasks({ kru_category_id: Number(id) });

  const { mutate, isPending: mutating } = editAddKruTaskMutation();
  const { mutate: deleteTask, isPending: deleting } = kruTaskDeletion();
  const [selected_answers, $selected_answers] = useState<ValueLabel[]>([]);
  const [open, setOpen] = useState(false);
  const [selected_task, $selected_task] = useState<number>();

  const showModal = () => setOpen(true);
  const hideModal = () => {
    setOpen(false);
    if (selected_task) $selected_task(undefined);
  };

  const handleEdit = (item: KruTaskRes) => {
    reset({
      task_name: item?.name,
      description: item?.description,
    });
    $selected_answers(
      item.answers?.map((item) => ({ label: item, value: item })) || []
    );
    showModal();
    $selected_task(item.id);
  };
  const onSubmit = () => {
    const { task_name, description } = getValues();

    mutate(
      {
        kru_category_id: Number(id),
        name: task_name,
        description,
        id: selected_task,
        answers: selected_answers.map((item) => `${item.value}`),
      },
      {
        onSuccess: () => {
          refetch();
          hideModal();
          successToast("created");
          reset({ task_name: "", description: "" });
          $selected_answers([]);
          $selected_task(undefined);
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const columns = useMemo<ColumnsType<KruTaskRes>>(
    () => [
      {
        title: "№",
        dataIndex: "",
        width: 50,
        className: "!px-0 py-2 text-center",
        render: (_, r, idx) => handleIdx(idx),
      },
      {
        title: t("task_name"),
        dataIndex: "name",
      },
      {
        title: t("description"),
        dataIndex: "description",
      },
      {
        title: "",
        width: 50,
        className: "!p-2",
        dataIndex: "delete",
        render: (_, record) =>
          perm?.has(MainPermissions.add_kru_sub_tasks) && (
            <Flex gap={10}>
              <Popconfirm
                title="Вы действительно хотите удалить эту подзадачу?"
                onConfirm={() => handleDelete(record.id)}
                okText={t("yes")}
                cancelText={t("no")}
              >
                <DeleteOutlined color="red" />
              </Popconfirm>
              <button onClick={() => handleEdit(record)}>
                <EditOutlined />
              </button>
            </Flex>
          ),
      },
    ],
    []
  );

  const handleSelect = (data: any, option: any) => {
    if (!selected_answers.find((tool) => tool.value === data.value))
      $selected_answers((prev) => [
        ...prev,
        { value: data.value, label: data.value },
      ]);
  };

  const handleDesect = (id: any) => {
    $selected_answers((prev) => prev.filter((tool) => tool.value !== id.value));
  };

  useEffect(() => {
    reset({
      category_name: category?.name,
    });
  }, [category]);

  return (
    <Card>
      <Header title={"add"}>
        {!isMobile && (
          <Button type="primary" onClick={() => navigate("/kru-tasks")}>
            {t("back")}
          </Button>
        )}
      </Header>

      <div className="content w-full">
        <BaseInputs className="relative" label="task">
          <MainInput register={register("category_name")} disabled />
        </BaseInputs>

        <Flex wrap justify="space-between" align="center" className="mb-4">
          <h2>{t("subtasks")}</h2>
          <Button type="primary" onClick={showModal}>
            {t("add_sub_tasks")}
          </Button>
        </Flex>

        <Modal
          title={t("add_sub_tasks")}
          open={open}
          onCancel={hideModal}
          footer={null}
          okButtonProps={{ className: "text-black" }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <BaseInputs label="task_name" error={errors.task_name}>
              <MainInput
                register={register("task_name", {
                  required: t("required_field"),
                })}
              />
            </BaseInputs>
            <BaseInputs label="answers">
              <Select
                mode="tags"
                labelInValue
                style={{ width: "100%" }}
                // onChange={handleChange}
                onSelect={handleSelect}
                onDeselect={handleDesect}
                tokenSeparators={[","]}
                open={false}
                value={selected_answers}
                // options={options}
              />
            </BaseInputs>
            <BaseInputs label="description">
              <MainTextArea register={register("description")} />
            </BaseInputs>

            <Flex justify="end" gap={20}>
              <Button danger key={"delete"} onClick={hideModal}>
                {t("cancelation")}
              </Button>
              <Button
                key="submit"
                type="primary"
                color="default"
                htmlType="submit"
                // variant="solid"
                onClick={() => null}
              >
                {t("add")}
              </Button>
            </Flex>
          </form>
        </Modal>

        <AntdTable
          isLoading={isLoading || taskLoading || deleting}
          data={tasks?.items}
          columns={columns}
        />
      </div>

      {mutating && <Loading />}
    </Card>
  );
};

export default AddKRUSubTasks;
