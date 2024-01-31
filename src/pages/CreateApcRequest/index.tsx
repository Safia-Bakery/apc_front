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
import { Departments, MainPermissions, Sphere } from "@/utils/types";
import WarehouseSelect from "@/components/WarehouseSelect";
import Loading from "@/components/Loader";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";

const CreateApcRequest = () => {
  const [files, $files] = useState<FileItem[]>();
  const { mutate, isLoading } = requestMutation();
  const branchJson = useQueryString("branch");
  const sphere_status = Number(useQueryString("sphere_status"));
  const branch = branchJson && JSON.parse(branchJson);
  const perm = useAppSelector(permissionSelector);
  const { data: categories, isLoading: categoryLoading } = useCategories({
    department: Departments.apc,
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
        onError: (e: any) => errorToast(e.message),
      }
    );
  };

  const renderBranchSelect = useMemo(() => {
    if (perm?.[MainPermissions.get_fillials_list]) {
      if (sphere_status === Sphere.fabric) return <WarehouseSelect />;
      else return <BranchSelect origin={1} enabled />;
    }
  }, [sphere_status]);

  if (isLoading || categoryLoading) return <Loading absolute />;

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
          {renderBranchSelect}
        </BaseInputs>
        <BaseInputs label="КАТЕГОРИЕ" error={errors.department}>
          <MainSelect
            values={categories?.items}
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
            className={`btn btn-info btn-fill float-end ${styles.btn}`}
          >
            Создать
          </button>
        </div>
      </form>
    </Card>
  );
};

export default CreateApcRequest;
