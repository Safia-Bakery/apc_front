import { useState } from "react";
import { useForm } from "react-hook-form";
import { successToast } from "src/utils/toast";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";
import cl from "classnames";
import requestMutation from "src/hooks/mutation/orderMutation";
import { useAppSelector } from "src/redux/utils/types";
import { categorySelector } from "src/redux/reducers/cache";
import UploadComponent, { FileItem } from "src/components/FileUpload";
import styles from "./index.module.scss";
import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import MainInput from "src/components/BaseInputs/MainInput";
import MainTextArea from "src/components/BaseInputs/MainTextArea";
import useQueryString from "src/hooks/useQueryString";
import BranchSelect from "src/components/BranchSelect";

const CreateApcRequest = () => {
  const [files, $files] = useState<FormData>();
  const categories = useAppSelector(categorySelector);
  const { mutate } = requestMutation();
  const choose_fillial = useQueryString("choose_fillial");
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

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
          successToast("Заказ успешно создано");
          navigate("/requests-apc");
        },
      }
    );
  };

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
          error={errors.department}
        >
          <div
            className="pointer"
            onClick={() => navigate("?choose_fillial=true")}
          >
            <MainInput
              value={branch?.name || ""}
              register={register("fillial", { required: "Обязательное поле" })}
            />
          </div>
          {!!choose_fillial && choose_fillial !== "false" && <BranchSelect />}
        </BaseInputs>
        <BaseInputs label="КАТЕГОРИЕ" error={errors.department}>
          <MainSelect
            values={categories}
            register={register("category_id", {
              required: "Обязательное поле",
            })}
          />
        </BaseInputs>

        <BaseInputs label="Продукт">
          <MainInput register={register("product")} />
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

export default CreateApcRequest;
