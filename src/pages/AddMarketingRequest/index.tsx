import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { successToast } from "src/utils/toast";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";
import cl from "classnames";
import requestMutation from "src/hooks/mutation/orderMutation";
import UploadComponent, { FileItem } from "src/components/FileUpload";
import styles from "./index.module.scss";
import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import MainTextArea from "src/components/BaseInputs/MainTextArea";
import useQueryString from "src/hooks/custom/useQueryString";
import BranchSelect from "src/components/BranchSelect";
import useCategories from "src/hooks/useCategories";
import Loading from "src/components/Loader";
import { MainPermissions, MarketingSubDep } from "src/utils/types";
import { useAppSelector } from "src/store/utils/types";
import { permissionSelector } from "src/store/reducers/sidebar";

const AddMarketingRequest = () => {
  const [files, $files] = useState<FormData>();
  const { mutate } = requestMutation();
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const [filemsg, $filemsg] = useState<string>();
  const perm = useAppSelector(permissionSelector);

  const title = useQueryString("title");
  const sub_id = useQueryString("sub_id");
  const add = useQueryString("add") || 0;
  const edit = useQueryString("edit") || "";
  const { data: categories, isLoading } = useCategories({
    sub_id: Number(sub_id),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const back = useNavigate();
  const goBack = () => back(-1);

  const handleFilesSelected = (data: FileItem[]) => {
    const formData = new FormData();
    if (data.length < 2) $filemsg("Добавьте минимум два файла");
    if (data.length >= 2) $filemsg(undefined);
    data.forEach((item) => {
      formData.append("files", item.file, item.file.name);
    });
    $files(formData);
  };
  const onSubmit = () => {
    const { category_id, description, product } = getValues();
    if (!filemsg)
      mutate(
        {
          category_id,
          product,
          description,
          fillial_id: branch?.id,
          files,
        },
        {
          onSuccess: () => {
            successToast("Заказ успешно создано");
            back(
              `/marketing-${
                MarketingSubDep[Number(sub_id)]
              }?sub_id=${sub_id}&add=${add}&edit=${edit}&title=${title}`
            );
          },
        }
      );
  };

  useEffect(() => {
    reset({
      fillial_id: branch?.name,
    });
  }, [branch?.name]);

  if (isLoading) return <Loading absolute />;

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
        <BaseInputs className="relative" label="ФИЛИАЛ" error={errors.fillial}>
          {perm?.[MainPermissions.get_fillials_list] && (
            <BranchSelect enabled />
          )}
        </BaseInputs>
        <BaseInputs label="КАТЕГОРИЕ" error={errors.department}>
          <MainSelect
            values={categories?.items || []}
            register={register("category_id", {
              required: "Обязательное поле",
            })}
          />
        </BaseInputs>

        <BaseInputs label="Комментарии" error={errors.description}>
          <MainTextArea
            register={register("description", {
              required: "Обязательное поле",
              minLength: { value: 60, message: "Минимум 60 символов" },
            })}
            placeholder="Комментарии"
          />
        </BaseInputs>

        <BaseInputs
          className={`mb-4 ${styles.uploadImage}`}
          label="Добавить файл"
        >
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
            className={`btn btn-info btn-fill float-end ${styles.btn}`}
          >
            Создать
          </button>
        </div>
      </form>
    </Card>
  );
};

export default AddMarketingRequest;
