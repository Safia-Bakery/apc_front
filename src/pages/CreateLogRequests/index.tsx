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
import { useTranslation } from "react-i18next";

const CreateLogRequests = () => {
  const { t } = useTranslation();
  const [files, $files] = useState<FileItem[]>();
  const { mutate, isPending } = requestMutation();
  const branchJson = useQueryString("branch");
  const [start, $start] = useState<Date>();
  const branch = branchJson && JSON.parse(branchJson);
  const [error, $error] = useState<string>();
  const { data: categories, isLoading: categoryLoading } = useCategories({
    department: Departments.car_requests,
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
    if (!start) $error(t("required_field"));
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
          onError: (e) => errorToast(e.message),
        }
      );
    }
  };

  if (isPending || categoryLoading) return <Loading />;

  return (
    <Card>
      <Header title={"create_order"}>
        <button className="btn btn-primary  " onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form
        className={cl("content", styles.form)}
        onSubmit={handleSubmit(onSubmit)}
      >
        <BaseInputs
          className="relative"
          label={t("branch")}
          error={errors.fillial_id}
        >
          <BranchSelect origin={1} enabled />
        </BaseInputs>

        <BaseInputs label="category" error={errors.category_id}>
          <MainSelect
            values={categories?.items}
            register={register("category_id", {
              required: t("required_field"),
            })}
          />
        </BaseInputs>

        <BaseInputs error={errors.size} label="show_weight_size">
          <MainInput
            register={register("size", {
              required: t("required_field"),
            })}
          />
        </BaseInputs>

        <BaseInputs label="select_needed_time" className="relative">
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

        <BaseInputs label="comments">
          <MainTextArea
            register={register("description")}
            placeholder={t("comments")}
          />
        </BaseInputs>

        <BaseInputs
          className={`mb-4 ${styles.uploadImage}`}
          label="add_file"
          error={errors.image}
        >
          <UploadComponent onFilesSelected={handleFilesSelected} />
        </BaseInputs>
        <div>
          <button
            type="submit"
            className={`btn btn-info   float-end ${styles.btn}`}
          >
            {t("create")}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default CreateLogRequests;
