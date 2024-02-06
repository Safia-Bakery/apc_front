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

interface Props {
  sphere_status?: Sphere;
  dep?: Departments;
}

const EditAddCategory: FC<Props> = ({ sphere_status, dep }) => {
  const { id, sphere } = useParams();
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  const { refetch: categoryRefetch } = useCategories({
    enabled: false,
    department: dep,
    page: 1,
    ...((sphere_status || !!sphere) && {
      sphere_status: Number(sphere) || sphere_status,
    }),
  });

  const {
    data: category,
    isLoading,
    refetch,
  } = useCategory({ id: Number(id) });
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
    const { name, description, urgent, status, sub_id, files, time } =
      getValues();
    mutate(
      {
        name,
        description,
        status: +!!status,
        urgent: +!!urgent,
        department: dep,
        sphere_status: Number(sphere) || sphere_status || Sphere.retail,
        ...(!!time && { ftime: +time }),
        ...(id && { id: +id }),
        ...(!!files?.length && { file: files[0] }),
        ...(!!sub_id && { sub_id: +sub_id }),
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

  if (isLoading && !!id) return;

  return (
    <Card className="overflow-hidden pb-3">
      <Header title={!id ? "Добавить" : `Изменить категорие №${id}`}>
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
