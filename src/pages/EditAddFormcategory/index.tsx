import { FC, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import Card from "@/components/Card";
import Header from "@/components/Header";
import useCategory from "@/hooks/useCategory";
import categoryMutation from "@/hooks/mutation/categoryMutation";
import useCategories from "@/hooks/useCategories";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import { Departments, Sphere } from "@/utils/types";
import useQueryString from "@/hooks/custom/useQueryString";
import { useTranslation } from "react-i18next";
import Loading from "@/components/Loader";

interface Props {
  sphere_status?: Sphere;
  dep?: Departments;
}

const EditAddFormcategory: FC<Props> = ({ sphere_status, dep }) => {
  const { t } = useTranslation();
  const { id, sphere } = useParams();
  const navigate = useNavigate();
  const parent_name = useQueryString("parent_name");

  const goBack = () => navigate(-1);

  const {
    data: category,
    isLoading,
    refetch,
  } = useCategory({ id: Number(id) });
  const { refetch: categoryRefetch } = useCategories({
    enabled: false,
    page: 1,
    department: dep,
    ...((sphere_status || !!sphere) && {
      sphere_status: Number(sphere) || sphere_status,
    }),
    ...(!!category?.parent_id && { parent_id: category.parent_id }),
  });
  const { mutate } = categoryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    watch,
  } = useForm();

  const onSubmit = () => {
    const { name, description, urgent, status, price } = getValues();
    mutate(
      {
        name,
        description,
        status: +!!status,
        urgent: +!!urgent,
        department: dep,
        price,
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
      });
    }
  }, [category, reset]);

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

        {dep === Departments.APC && (
          <MainCheckBox label="last" register={register("is_child")} />
        )}

        {dep === Departments.marketing && (
          <BaseInput label="upload_photo" className="relative">
            <MainInput
              value={
                !!watch("files")?.length ? `${watch("files")?.[0].name}` : ""
              }
              register={register("image_name")}
            />
            <MainInput
              type="file"
              register={register("files")}
              className="opacity-0 absolute right-0 bottom-0"
            />
          </BaseInput>
        )}

        <button type="submit" className="btn btn-success   float-end">
          {t("save")}
        </button>
      </form>
    </Card>
  );
};

export default EditAddFormcategory;
