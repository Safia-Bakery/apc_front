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
import { Button, Flex, Modal, Popconfirm } from "antd";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "@/store/reducers/sidebar";
import { MainPermissions } from "@/utils/permissions";

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

  const [open, setOpen] = useState(false);

  const showModal = () => setOpen(true);
  const hideModal = () => setOpen(false);

  const handleEdit = (item: KruTaskRes) => {
    reset({
      task_name: item?.name,
      description: item?.description,
      task_id: item.id,
    });
    showModal();
  };

  const onSubmit = () => {
    const { task_name, description, task_id } = getValues();

    mutate(
      {
        kru_category_id: Number(id),
        name: task_name,
        description,
        id: task_id,
      },
      {
        onSuccess: () => {
          refetch();
          hideModal();
          successToast("created");
          reset({ task_name: "", description: "", task_id: undefined });
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
        className: "!px-0 text-center",
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
        width: 100,
        dataIndex: "delete",
        render: (_, record) =>
          perm?.[MainPermissions.add_kru_sub_tasks] && (
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

        <Flex wrap justify="space-between" align="center">
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
            <BaseInputs label="task_description">
              <MainInput register={register("description")} />
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

        {/* {isMobile && (
          <div className="mb-2 z-10 relative">
            <button
              type="button"
              className={cl("btn btn-primary w-min")}
              onClick={addInputFields}
            >
              {t("add")}
            </button>
          </div>
        )} */}
      </div>

      {mutating && <Loading />}
    </Card>
  );
};

export default AddKRUSubTasks;
