import { FC, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import Card from "@/components/Card";
import Header from "@/components/Header";
import useCategory from "@/hooks/useCategory";
import categoryMutation from "@/hooks/mutation/categoryMutation";
import useCategories from "@/hooks/useCategories";
import { errorToast, successToast } from "@/utils/toast";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import { Departments, MarketingSubDepRu, Sphere } from "@/utils/types";
import MainSelect from "@/components/BaseInputs/MainSelect";
import { imageConverter } from "@/utils/helpers";
import { baseURL } from "@/main";
import useQueryString from "@/hooks/custom/useQueryString";

interface Props {
  sphere_status?: Sphere;
  dep?: Departments;
}

const EditAddCategory: FC<Props> = ({ sphere_status, dep }) => {
  const { id, sphere } = useParams();
  const navigate = useNavigate();
  const parent_id = Number(useQueryString("parent_id"));
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
    const { name, description, urgent, status, sub_id, files, time, is_child } =
      getValues();
    mutate(
      {
        name,
        description,
        status: +!!status,
        urgent: +!!urgent,
        department: dep,
        is_child,
        sphere_status: Number(sphere) || sphere_status || Sphere.retail,
        ...(!!time && { ftime: +time }),
        ...(id && { id: +id }),
        ...(!!files?.length && { file: files[0] }),
        ...(!!sub_id && { sub_id: +sub_id }),
        ...(!!parent_id && { parent_id }),
      },
      {
        onSuccess: () => {
          categoryRefetch();
          successToast(!!id ? "successfully updated" : "successfully created");
          goBack();
          if (id) refetch();
        },
        onError: (e: any) => errorToast(e.message),
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
        sub_id: Number(category?.sub_id),
        time: category.ftime,
        is_child: !!category.is_child,
      });
    }
  }, [category, reset]);

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

    if (category?.file && !!id)
      return (
        <img
          src={`${baseURL}/${category.file}`}
          alt="category-files"
          height={150}
          width={150}
        />
      );
    if (Number(dep) !== Departments.marketing) return;
  }, [watch("files"), category?.file, id]);

  const renderTitle = useMemo(() => {
    if (id) return `Изменить категорие №${id}`;
    else return parent_name ? `Добавить на ${parent_name}` : "Добавить";
  }, []);

  if (isLoading && !!id) return;

  return (
    <Card className="overflow-hidden pb-3">
      <Header title={renderTitle}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>
      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        {Number(dep) === Departments.marketing && (
          <BaseInput label="ОТДЕЛ" error={errors.name}>
            <MainSelect
              register={register("sub_id", { required: "Обязательное поле" })}
              values={MarketingSubDepRu}
            />
          </BaseInput>
        )}

        <BaseInput label="НАИМЕНОВАНИЕ" error={errors.name}>
          <MainInput
            register={register("name", { required: "Обязательное поле" })}
          />
        </BaseInput>

        {(Number(dep) === Departments.it ||
          Number(dep) === Departments.marketing) && (
          <BaseInput label="Время исполнении (в часах)" error={errors.time}>
            <MainInput
              register={register("time", { required: "Обязательное поле" })}
              type="number"
            />
          </BaseInput>
        )}

        <BaseInput label="ОПИСАНИЕ">
          <MainTextArea register={register("description")} />
        </BaseInput>

        <MainCheckBox
          label="Срочно"
          register={register("urgent")}
          value={!!category?.urgent}
        />

        <MainCheckBox label="Активный" register={register("status")} />

        <MainCheckBox label="Последний" register={register("is_child")} />

        {Number(dep) === Departments.marketing && (
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
        )}

        {renderImage}

        <button type="submit" className="btn btn-success btn-fill float-end">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default EditAddCategory;
