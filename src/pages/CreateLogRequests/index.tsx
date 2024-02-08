import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { errorToast, successToast } from "@/utils/toast";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import cl from "classnames";
import requestMutation from "@/hooks/mutation/orderMutation";
import UploadComponent, { FileItem } from "@/components/FileUpload";
import styles from "./index.module.scss";
import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import MainInput from "@/components/BaseInputs/MainInput";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import useQueryString from "custom/useQueryString";
import BranchSelect from "@/components/BranchSelect";
import useCategories from "@/hooks/useCategories";
import { Departments } from "@/utils/types";
import Loading from "@/components/Loader";
import MainDatePicker from "@/components/BaseInputs/MainDatePicker";
import dayjs from "dayjs";

const CreateLogRequests = () => {
  const [files, $files] = useState<FileItem[]>();
  const { mutate, isPending } = requestMutation();
  const branchJson = useQueryString("branch");
  const [start, $start] = useState<Date>();
  const branch = branchJson && JSON.parse(branchJson);
  const [error, $error] = useState<string>();
  const { data: categories, isLoading: categoryLoading } = useCategories({
    department: Departments.logystics,
    category_status: 1,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const navigate = useNavigate();
  const goBack = () => navigate("/requests-logystics");

  const handleDateStart = (event: Date) => $start(event);

  useEffect(() => {
    reset({
      fillial_id: branch?.id,
    });
  }, [branch?.id]);

  const handleFilesSelected = (data: FileItem[]) => $files(data);

  const onSubmit = () => {
    const { category_id, description, size } = getValues();
    if (!start) $error("Обязательное поле");
    else {
      mutate(
        {
          category_id,
          size,
          description,
          fillial_id: branch?.id,
          arrival_date: start?.toISOString(),
          files,
        },
        {
          onSuccess: () => {
            successToast("Заказ успешно создано");
            goBack();
          },
          onError: (e: any) => errorToast(e.message),
        }
      );
    }
  };

  if (isPending || categoryLoading) return <Loading absolute />;

  return (
    <Card>
      <Header title={"Создать заказ"}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <form
        className={cl("content", styles.form)}
        onSubmit={handleSubmit(onSubmit)}
      >
        <BaseInputs
          className="relative"
          label="ФИЛИАЛ"
          error={errors.fillial_id}
        >
          <BranchSelect origin={1} enabled />
        </BaseInputs>

        <BaseInputs label="КАТЕГОРИЕ" error={errors.category_id}>
          <MainSelect
            values={categories?.items}
            register={register("category_id", {
              required: "Обязательное поле",
            })}
          />
        </BaseInputs>

        <BaseInputs error={errors.size} label="Укажите вес/размер">
          <MainInput
            register={register("size", {
              required: "Обязательное поле",
            })}
          />
        </BaseInputs>

        <BaseInputs
          label="Укажите в какое время вам нужна машина"
          className="relative"
        >
          <MainDatePicker
            showTimeSelect
            selected={!!start ? dayjs(start || undefined).toDate() : undefined}
            onChange={handleDateStart}
          />
          {error && (
            <div className="alert alert-danger p-2" role="alert">
              {error}
            </div>
          )}
        </BaseInputs>

        <BaseInputs label="Комментарии">
          <MainTextArea
            register={register("description")}
            placeholder="Комментарии"
          />
        </BaseInputs>

        <BaseInputs
          className={`mb-4 ${styles.uploadImage}`}
          label="Добавить файл"
          error={errors.image}
        >
          <UploadComponent onFilesSelected={handleFilesSelected} />
        </BaseInputs>
        <div>
          <button
            type="submit"
            className={`btn btn-info btn-fill float-end ${styles.btn}`}
          >
            Создать
          </button>
        </div>
      </form>
    </Card>
  );
};

export default CreateLogRequests;
