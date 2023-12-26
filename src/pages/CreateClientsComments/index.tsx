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
import { MainPermissions, Sphere } from "@/utils/types";
import WarehouseSelect from "@/components/WarehouseSelect";
import Loading from "@/components/Loader";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import { clientCommentCategoryId as category_id } from "@/utils/helpers";

const CreateClientsComments = () => {
  const [files, $files] = useState<FileItem[]>();
  const { mutate, isLoading } = requestMutation();
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const perm = useAppSelector(permissionSelector);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  useEffect(() => {
    reset({
      fillial_id: branch?.id,
    });
  }, [branch?.id]);

  const handleFilesSelected = (data: FileItem[]) => $files(data);

  const onSubmit = () => {
    const { description, product } = getValues();
    mutate(
      {
        category_id,
        product,
        description,
        fillial_id: branch?.id,
        files,
      },
      {
        onSuccess: () => navigate("/client-comments"),
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const renderFileUpload = useMemo(() => {
    return (
      <BaseInputs
        className={`mb-4 ${styles.uploadImage}`}
        label="Добавить файл"
        error={errors.image}
      >
        <UploadComponent onFilesSelected={handleFilesSelected} />
      </BaseInputs>
    );
  }, [files]);

  const renderBranchSelect = useMemo(() => {
    if (perm?.[MainPermissions.get_fillials_list]) {
      return <BranchSelect origin={1} enabled />;
    }
  }, []);

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
        <BaseInputs className="relative" label="ФИЛИАЛ">
          {renderBranchSelect}
        </BaseInputs>

        <BaseInputs label="Сотрудник">
          <MainInput register={register("product")} />
        </BaseInputs>

        <BaseInputs label="Комментарии">
          <MainTextArea
            register={register("description")}
            placeholder="Комментарии"
          />
        </BaseInputs>

        {renderFileUpload}
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

export default CreateClientsComments;
