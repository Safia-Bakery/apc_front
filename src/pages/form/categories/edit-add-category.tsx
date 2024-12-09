import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import Card from "@/components/Card";
import Header from "@/components/Header";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import useQueryString from "@/hooks/custom/useQueryString";
import { useTranslation } from "react-i18next";
import Loading from "@/components/Loader";
import {
  editAddFormCategory,
  getFormCategories,
  getFormCategory,
} from "@/hooks/forms";

const EditAddFormcategory = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const parent_name = useQueryString("parent_name");

  const goBack = () => navigate(-1);

  const {
    data: category,
    isLoading,
    refetch,
  } = getFormCategory({ id: Number(id), enabled: !!id });
  const { refetch: categoryRefetch } = getFormCategories({
    enabled: false,
  });
  const { mutate } = editAddFormCategory();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = () => {
    const { name, description, urgent, status, price, universal_size } =
      getValues();
    mutate(
      {
        name,
        description,
        status: +!!status,
        urgent: !!urgent,
        price,
        universal_size: !!universal_size,
        ...(id && { id: +id }),
      },
      {
        onSuccess: () => {
          categoryRefetch();
          successToast(!!id ? "updated" : "created");
          goBack();
          if (id) refetch();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    if (category) {
      reset({
        name: category?.name,
        description: category?.description,
        urgent: category.urgent,
        status: !!category.status,
        price: category.price,
        universal_size: category.universal_size,
      });
    }
  }, [category]);

  const renderTitle = useMemo(() => {
    if (id) return `${t("edit_category")} №${id}`;
    else return parent_name ? `${t("add_to")} ${parent_name}` : "add";
  }, []);

  if (isLoading && !!id) return <Loading />;

  return (
    <Card className="overflow-hidden pb-3">
      <Header title={renderTitle}>
        <button className="btn btn-primary" onClick={goBack}>
          {t("back")}
        </button>
      </Header>
      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        <BaseInput label="name_in_table" error={errors.name}>
          <MainInput
            register={register("name", { required: t("required_field") })}
          />
        </BaseInput>

        <BaseInput label="price" error={errors.price}>
          <MainInput
            type="number"
            register={register("price", { required: t("required_field") })}
          />
        </BaseInput>

        <BaseInput label="description">
          <MainTextArea register={register("description")} />
        </BaseInput>

        <MainCheckBox
          label="urgent"
          register={register("urgent")}
          value={!!category?.urgent}
        />

        <MainCheckBox label={"active"} register={register("status")} />

        <MainCheckBox
          label={"universal_size"}
          register={register("universal_size")}
        />

        <button type="submit" className="btn btn-success float-end">
          {t("save")}
        </button>
      </form>
    </Card>
  );
};

export default EditAddFormcategory;
