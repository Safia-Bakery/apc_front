import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import cl from "classnames";
import requestMutation from "@/hooks/mutation/orderMutation";
import UploadComponent, { FileItem } from "@/components/FileUpload";
import styles from "./index.module.scss";
import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import useQueryString from "custom/useQueryString";
import BranchSelect from "@/components/BranchSelect";
import useCategories from "@/hooks/useCategories";
import Loading from "@/components/Loader";
import { MarketingSubDep } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import { useTranslation } from "react-i18next";

const AddMarketingRequest = () => {
  const { t } = useTranslation();
  const [files, $files] = useState<FileItem[]>();
  const { mutate } = requestMutation();
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const [filemsg, $filemsg] = useState<string>();
  const perm = useAppSelector(permissionSelector);

  const sub_id = Number(useQueryString("sub_id"));
  const { data: categories, isLoading } = useCategories({
    sub_id,
    category_status: 1,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const back = useNavigate();
  const goBack = () => back(`/marketing-${MarketingSubDep[sub_id]}`);

  const handleFilesSelected = (data: FileItem[]) => {
    if (data.length < 2) $filemsg(t("add_min_two_files"));
    if (data.length >= 2) $filemsg(undefined);
    $files(data);
  };
  const onSubmit = () => {
    const { category_id, description } = getValues();
    if (!filemsg)
      mutate(
        {
          category_id,
          description,
          fillial_id: branch?.id,
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
  };

  useEffect(() => {
    reset({
      fillial_id: branch?.name,
    });
  }, [branch?.name]);

  if (isLoading) return <Loading />;

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
          error={errors.fillial}
        >
          {perm?.has(MainPermissions.get_fillials_list) && (
            <BranchSelect enabled />
          )}
        </BaseInputs>
        <BaseInputs label="categories" error={errors.department}>
          <MainSelect
            values={categories?.items || []}
            register={register("category_id", {
              required: t("required_field"),
            })}
          />
        </BaseInputs>

        <BaseInputs label="comments" error={errors.description}>
          <MainTextArea
            register={register("description", {
              required: t("required_field"),
            })}
            placeholder={t("comments")}
          />
        </BaseInputs>

        <BaseInputs className={`mb-4 ${styles.uploadImage}`} label="add_file">
          <UploadComponent onFilesSelected={handleFilesSelected} />
          {filemsg && (
            <div className="alert alert-danger p-2" role="alert">
              {filemsg}
            </div>
          )}
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

export default AddMarketingRequest;
