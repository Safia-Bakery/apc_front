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
import { Departments, Sphere } from "@/utils/types";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";

const CreateApcRequest = () => {
  const { t } = useTranslation();
  const [files, $files] = useState<FileItem[]>();
  const { mutate, isPending } = requestMutation();
  const branchJson = useQueryString("branch");
  const sphere_status = Number(useQueryString("sphere_status"));
  const branch = branchJson && JSON.parse(branchJson);
  const { data: categories, isLoading: categoryLoading } = useCategories({
    department: Departments.APC,
    sphere_status,
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
  const goBack = () => navigate(`/requests-apc-${Sphere[sphere_status]}`);

  useEffect(() => {
    reset({
      fillial_id: branch?.id,
    });
  }, [branch?.id]);

  const handleFilesSelected = (data: FileItem[]) => $files(data);

  const onSubmit = () => {
    const { category_id, description, product } = getValues();
    mutate(
      {
        category_id,
        product,
        description,
        fillial_id: branch?.id,
        files,
        factory: sphere_status === Sphere.fabric,
      },
      {
        onSuccess: () => {
          successToast("Заказ успешно создано");
          goBack();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const renderBranchSelect = useMemo(() => {
    return (
      <BranchSelect
        origin={1}
        enabled
        warehouse={sphere_status === Sphere.fabric}
      />
    );
  }, [sphere_status]);

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
          {renderBranchSelect}
        </BaseInputs>
        <BaseInputs label="category" error={errors.department}>
          <MainSelect
            values={categories?.items}
            register={register("category_id", {
              required: t("required_field"),
            })}
          />
        </BaseInputs>

        <BaseInputs label="productt">
          <MainInput register={register("product")} />
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

export default CreateApcRequest;
