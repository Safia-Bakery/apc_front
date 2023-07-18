import { useState } from "react";
import { useForm } from "react-hook-form";
import { successToast } from "src/utils/toast";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";
import cl from "classnames";
import orderMutation from "src/hooks/mutation/orderMutation";
import { useAppSelector } from "src/redux/utils/types";
import {
  branchSelector,
  categorySelector,
} from "src/redux/reducers/cacheResources";
import useOrders from "src/hooks/useOrders";
import UploadComponent, { FileItem } from "src/components/FileUpload";
import styles from "./index.module.scss";

const CreateOrder = () => {
  const [files, $files] = useState<any>();
  const branches = useAppSelector(branchSelector);
  const categories = useAppSelector(categorySelector);
  const { mutate } = orderMutation();
  const { refetch: ordersRefetch } = useOrders({ enabled: false });

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
    const { urgent, category_id, fillial_id, description } = getValues();

    mutate(
      {
        category_id,
        product: "s",
        urgent,
        description,
        fillial_id,
        files,
      },
      {
        onSuccess: () => {
          ordersRefetch();
          successToast("Заказ успешно создано");
          navigate("/orders");
        },
      }
    );
  };

  // const convertFilesToFormData = (): FormData => {
  //   const formData = new FormData();
  //   fileList.forEach((item) => {
  //     formData.append("files", item.file, item.file.name);
  //   });
  //   return formData;
  // };

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
        <div className="form-group">
          <label>ФИЛИАЛ</label>
          <select
            defaultValue={"Select Item"}
            className="form-select"
            {...register("fillial_id")}
          >
            {branches?.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          {errors.department && (
            <div className="alert alert-danger p-2" role="alert">
              {errors.department.message?.toString()}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>КАТЕГОРИЯ</label>
          <select
            defaultValue={"Select Item"}
            {...register("category_id")}
            className="form-select"
          >
            {categories?.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {errors.department && (
            <div className="alert alert-danger p-2" role="alert">
              {errors.department.message?.toString()}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Комментарии</label>
          <textarea
            rows={4}
            {...register("description")}
            className={`form-control ${styles.textArea}`}
            name="description"
            placeholder="Комментарии"
          />
        </div>

        <div className={`mb-4 ${styles.uploadImage}`}>
          <label>Добавить файл</label>
          {/* <FileUploader onFilesSelected={handleFilesSelected} /> */}

          <UploadComponent onFilesSelected={handleFilesSelected} />

          {errors.image && (
            <div className="alert alert-danger p-2" role="alert">
              {errors.image.message?.toString()}
            </div>
          )}
        </div>

        <div className="form-group d-flex align-items-center form-control">
          <label className="mb-0 mr-2">urgent</label>
          <input type="checkbox" {...register("urgent")} />
        </div>
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

export default CreateOrder;
