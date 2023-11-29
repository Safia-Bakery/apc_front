import { useState } from "react";
import { useForm } from "react-hook-form";
import { successToast } from "src/utils/toast";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";
import cl from "classnames";
import requestMutation from "src/hooks/mutation/orderMutation";

import useOrders from "src/hooks/useOrders";
import UploadComponent, { FileItem } from "src/components/FileUpload";
import styles from "./index.module.scss";

import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import MainInput from "src/components/BaseInputs/MainInput";
import BaseInput from "src/components/BaseInputs";
import MainTextArea from "src/components/BaseInputs/MainTextArea";
import useUsers from "src/hooks/useUsers";
import Loading from "src/components/Loader";
import { Departments } from "src/utils/types";
import useCategories from "src/hooks/useCategories";
import useBranches from "src/hooks/useBranches";

const CreateITRequest = () => {
  const [files, $files] = useState<FormData>();
  const { data: branches } = useBranches({});
  const { data: categories } = useCategories({
    department: Departments.it,
  });
  const { mutate } = requestMutation();
  const { refetch: requestsRefetch } = useOrders({
    enabled: false,
    department: Departments.it,
  });
  const { data: users, isLoading } = useUsers({});

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const handleFilesSelected = (data: FileItem[]) => {
    const formData = new FormData();
    data.forEach((item) => {
      formData.append("files", item.file, item.file.name);
    });
    $files(formData);
  };
  const onSubmit = () => {
    const { urgent, category_id, fillial_id, description, product } =
      getValues();
    mutate(
      {
        category_id,
        product,
        // urgent,
        description,
        fillial_id,
        files,
      },
      {
        onSuccess: () => {
          requestsRefetch();
          successToast("Заказ успешно создано");
          navigate("/requests-apc");
        },
      }
    );
  };

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
        <BaseInput label="СОТРУДНИК" error={errors.user}>
          <MainSelect register={register("user")}>
            <option value={undefined}></option>
            {users?.items?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.full_name}
              </option>
            ))}
          </MainSelect>
        </BaseInput>
        <BaseInput label="ФИЛИАЛ" error={errors.department}>
          <MainSelect
            values={branches?.items}
            register={register("fillial_id")}
          />
        </BaseInput>
        <BaseInputs label="КАТЕГОРИЕ" error={errors.department}>
          <MainSelect
            values={categories?.items}
            register={register("category_id")}
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
        <div className="form-group flex align-center form-control">
          <label className="mb-0 mr-2">Срочно</label>
          <input type="checkbox" {...register("urgent")} />
        </div>
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

export default CreateITRequest;
