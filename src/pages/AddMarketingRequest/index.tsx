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
import useQueryString from "src/hooks/useQueryString";
import BranchSelect from "src/components/BranchSelect";
import useCategories from "src/hooks/useCategories";
import Loading from "src/components/Loader";
import { MarketingSubDep } from "src/utils/types";

const AddMarketingRequest = () => {
  const [files, $files] = useState<FormData>();
  const { mutate } = requestMutation();
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const sub_id = useQueryString("sub_id");
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
    data.forEach((item) => {
      formData.append("files", item.file, item.file.name);
    });
    $files(formData);
  };
  const onSubmit = () => {
    const { category_id, description, product } = getValues();
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
          // requestsRefetch();
          successToast("Заказ успешно создано");
          back(
            `/marketing-${MarketingSubDep[Number(sub_id)]}?sub_id=${sub_id}`
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

  if (isLoading) return <Loading />;

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
          className="position-relative"
          label="ФИЛИАЛ"
          error={errors.fillial}
        >
          <BranchSelect />
        </BaseInputs>
        <BaseInputs label="КАТЕГОРИЕ" error={errors.department}>
          <MainSelect
            values={categories?.items || []}
            register={register("category_id", {
              required: "Обязательное поле",
            })}
          />
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
            className={`btn btn-info btn-fill pull-right ${styles.btn}`}
          >
            Создать
          </button>
        </div>
      </form>
    </Card>
  );
};

export default AddMarketingRequest;
