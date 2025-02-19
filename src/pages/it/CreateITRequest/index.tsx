import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import cl from "classnames";
import { useNavigate, useParams } from "react-router-dom";

import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import Card from "@/components/Card";
import Header from "@/components/Header";
import styles from "./index.module.scss";
import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import useQueryString from "custom/useQueryString";
import BranchSelect from "@/components/BranchSelect";
import useCategories from "@/hooks/useCategories";
import { Departments } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";
import Loading from "@/components/Loader";
import { useAppSelector } from "@/store/utils/types";
import { permissionSelector } from "reducers/sidebar";
import { useTranslation } from "react-i18next";
import MainDropZone from "@/components/MainDropZone";
import { itRequestMutation } from "@/hooks/it";

interface InventoryFields {
  product: string;
  qnt: string | number;
  category_id: number;
}

interface FormDataTypes {
  inputFields: InventoryFields[];
  order_type: number;
  fillial_id: string;
  description: string;
  category_id?: number;
}

const initialInventory: InventoryFields | undefined = {
  product: "",
  qnt: 1,
  category_id: 0,
};

const CreateITRequest = () => {
  const { t } = useTranslation();
  const [files, $files] = useState<string[]>([]);
  const { mutate, isPending } = itRequestMutation();
  const { sphere } = useParams();
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const perm = useAppSelector(permissionSelector);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormDataTypes>({
    defaultValues: { inputFields: [initialInventory] },
  });

  const { data: categories, isLoading: categoryLoading } = useCategories({
    department: Departments.IT,
    sphere_status: Number(sphere),
    enabled: !!sphere,
    category_status: 1,
  });

  const navigate = useNavigate();
  const goBack = () => navigate(`/requests-it/${sphere}`);

  const onSubmit = (data: FormDataTypes) => {
    const { category_id, description } = data;
    mutate(
      {
        category_id,
        description,
        fillial_id: branch?.id,
        files,
      },
      {
        onSuccess: () => {
          goBack();
          successToast("Заказ успешно создано");
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  const renderBranches = useMemo(() => {
    return (
      <BaseInputs
        className="relative"
        label={t("branch")}
        error={errors.fillial_id}
      >
        {perm?.has(MainPermissions.get_fillials_list) && (
          <BranchSelect origin={1} enabled />
        )}
      </BaseInputs>
    );
  }, [branch]);

  useEffect(() => {
    reset({
      fillial_id: branch?.id,
    });
  }, [branch?.id]);

  if (isPending || (categoryLoading && !!sphere)) return <Loading />;

  return (
    <Card>
      <Header title="create_order">
        <button className="btn btn-primary" onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form
        className={cl("content", styles.form)}
        onSubmit={handleSubmit(onSubmit)}
      >
        {renderBranches}

        <BaseInputs label="category" error={errors.category_id}>
          <MainSelect
            values={categories?.items}
            register={register("category_id", {
              required: t("required_field"),
            })}
          />
        </BaseInputs>

        <BaseInputs label="comments" error={errors.description}>
          <MainTextArea
            register={register("description")}
            placeholder={t("comments")}
          />
        </BaseInputs>

        <BaseInputs className={`mb-4 ${styles.uploadImage}`} label="add_file">
          <MainDropZone setData={$files} defaultFiles={files} />
        </BaseInputs>
        <div>
          <button
            type="submit"
            className={`btn btn-info float-end ${styles.btn}`}
          >
            {t("create")}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default CreateITRequest;
