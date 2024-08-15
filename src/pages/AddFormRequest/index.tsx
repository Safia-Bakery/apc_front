import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { errorToast, successToast } from "@/utils/toast";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import cl from "classnames";
import requestMutation from "@/hooks/mutation/orderMutation";
import styles from "./index.module.scss";
import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import MainInput from "@/components/BaseInputs/MainInput";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import useQueryString from "custom/useQueryString";
import BranchSelect from "@/components/BranchSelect";
import useCategories from "@/hooks/useCategories";
import { Departments } from "@/utils/types";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";

const AddFormRequest = () => {
  const { t } = useTranslation();
  const { mutate, isPending } = requestMutation();
  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);
  const { data: categories, isLoading: categoryLoading } = useCategories({
    department: Departments.form,
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
  const goBack = () => navigate("/requests-form");

  useEffect(() => {
    reset({
      fillial_id: branch?.id,
    });
  }, [branch?.id]);

  const onSubmit = () => {
    const { category_id, description, size } = getValues();
    mutate(
      {
        category_id,
        size,
        description,
        fillial_id: branch?.id,
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

  if (isPending || categoryLoading) return <Loading />;

  return (
    <Card>
      <Header title={"create_order"}>
        <button className="btn btn-primary" onClick={goBack}>
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
          error={errors.fillial_id}
        >
          <BranchSelect origin={1} enabled />
        </BaseInputs>

        <BaseInputs label="category" error={errors.category_id}>
          <MainSelect
            values={categories?.items}
            register={register("category_id", {
              required: t("required_field"),
            })}
          />
        </BaseInputs>

        <BaseInputs error={errors.size} label="show_size">
          <MainInput
            register={register("size", {
              required: t("required_field"),
            })}
          />
        </BaseInputs>

        <BaseInputs error={errors.qnt} label="quantity">
          <MainInput
            type="number"
            register={register("description", {
              required: t("required_field"),
            })}
          />
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

export default AddFormRequest;
