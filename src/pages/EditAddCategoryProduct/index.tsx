import useCatProducts from "@/hooks/useCatProducts";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { errorToast, successToast } from "@/utils/toast";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import { imageConverter } from "@/utils/helpers";
import { baseURL } from "@/main";
import categoryProductMutation from "@/hooks/mutation/categoryProduct";
import { useTranslation } from "react-i18next";

const EditAddCategoryProduct = () => {
  const { t } = useTranslation();
  const { id: category_id, product_id } = useParams();

  const {
    data: products,
    isLoading,
    refetch: productRefetch,
  } = useCatProducts({
    category_id: Number(category_id),
    id: product_id,
    enabled: !!product_id,
  });

  const { refetch } = useCatProducts({
    category_id: Number(category_id),
    enabled: !!product_id,
  });

  const product = products?.[0];
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { mutate } = categoryProductMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    watch,
  } = useForm();

  const onSubmit = () => {
    const { name, description, status, files } = getValues();
    mutate(
      {
        name,
        description,
        status: +!!status,
        category_id,
        ...(product_id && { id: +product_id }),
        ...(!!files?.length && { image: files[0] }),
      },
      {
        onSuccess: () => {
          refetch();
          successToast(
            !!category_id ? "successfully updated" : "successfully created"
          );
          goBack();
          if (product_id) productRefetch();
        },
        onError: (e: any) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    if (product && product_id) {
      reset({
        name: product.name,
        description: product?.description,
        status: !!product.status,
      });
    }
  }, [product, product_id]);

  const renderImage = useMemo(() => {
    if (!!watch("files"))
      return (
        <img
          src={imageConverter(watch("files")?.[0])}
          alt="category-files"
          height={150}
          width={150}
        />
      );

    if (product?.image && !!category_id)
      return (
        <img
          src={`${baseURL}/${product.image}`}
          alt="category-files"
          height={150}
          width={150}
        />
      );
  }, [watch("files"), product?.image, category_id]);

  if (isLoading && !!category_id) return;

  return (
    <Card className="overflow-hidden pb-3">
      <Header
        title={!category_id ? "Добавить" : `Изменить категори  №${category_id}`}
      >
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          {t("back")}
        </button>
      </Header>
      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        <BaseInput label="НАИМЕНОВАНИЕ" error={errors.name}>
          <MainInput
            register={register("name", { required: t("required_field") })}
          />
        </BaseInput>

        <BaseInput label="ОПИСАНИЕ">
          <MainTextArea register={register("description")} />
        </BaseInput>

        <MainCheckBox label="Активный" register={register("status")} />

        <BaseInput label="ЗАГРУЗИТЬ ФОТО" className="relative">
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

        {renderImage}

        <button type="submit" className="btn btn-success btn-fill float-end">
          {t("save")}
        </button>
      </form>
    </Card>
  );
};

export default EditAddCategoryProduct;
