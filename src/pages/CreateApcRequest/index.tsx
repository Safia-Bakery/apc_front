import { useState } from "react";
import { useForm } from "react-hook-form";
import { successToast } from "src/utils/toast";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate } from "react-router-dom";
import cl from "classnames";
import orderMutation from "src/hooks/mutation/orderMutation";
import { useAppSelector } from "src/redux/utils/types";
import { branchSelector, categorySelector } from "src/redux/reducers/cache";
import useOrders from "src/hooks/useOrders";
import UploadComponent, { FileItem } from "src/components/FileUpload";
import styles from "./index.module.scss";

import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import MainInput from "src/components/BaseInputs/MainInput";
import BaseInput from "src/components/BaseInputs";
import MainTextArea from "src/components/BaseInputs/MainTextArea";
import SelectBranches from "src/components/SelectBranches";
import { BranchType } from "src/utils/types";

const CreateApcRequest = () => {
  const [files, $files] = useState<FormData>();
  const branches = useAppSelector(branchSelector);
  const categories = useAppSelector(categorySelector);
  const { mutate } = orderMutation();
  const { refetch: requestsRefetch } = useOrders({ enabled: false });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm();

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleItemClick = (itemId: string) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter((id) => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  const handleBranch = (product: BranchType) => {
    reset({ fillial_id: product.id, fillial: product.name });
  };

  const isItemExpanded = (itemId: string) => expandedItems.includes(itemId);

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
    const { urgent, category_id, fillial_id, description, product } =
      getValues();
    mutate(
      {
        category_id,
        product,
        urgent,
        description,
        fillial_id: "bc01b998-a0fb-4bc8-a61a-a0471f74e7a1",
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
        <BaseInput label="ФИЛИАЛ" error={errors.department}>
          <MainInput
            value="fillial"
            register={register("fillial", { required: "Обязательное поле" })}
          />
          <SelectBranches
            data={branches}
            isItemExpanded={isItemExpanded}
            handleItemClick={handleItemClick}
            handleBranch={handleBranch}
          />
        </BaseInput>
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
        <div className="form-group d-flex align-items-center form-control">
          <label className="mb-0 mr-2">Срочно</label>
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

export default CreateApcRequest;
