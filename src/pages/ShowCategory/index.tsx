import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import useCategory from "src/hooks/useCategory";
import { useEffect, useState } from "react";
import categoryMutation from "src/hooks/mutation/categoryMutation";
import useCategories from "src/hooks/useCategories";
import { successToast } from "src/utils/toast";
import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainTextArea from "src/components/BaseInputs/MainTextArea";
import MainCheckBox from "src/components/BaseInputs/MainCheckBox";

const ShowCategory = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { refetch: categoryRefetch } = useCategories({
    enabled: false,
    page: 1,
  });

  const { id } = useParams();

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
  } = useForm();

  const onSubmit = () => {
    const { name, description, urgent, status } = getValues();
    mutate(
      { name, description, status, ...(id && { id: Number(id) }), urgent },
      {
        onSuccess: () => {
          categoryRefetch();
          successToast(!!id ? "successfully updated" : "successfully created");
          navigate("/categories");
          if (id) refetch();
        },
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
      });
    }
  }, [category, reset]);

  if (isLoading && !!id) return;

  return (
    <Card>
      <Header title={!id ? "Добавить" : `Изменить категорие №${id}`}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>
      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        <BaseInput label="НАИМЕНОВАНИЕ" error={errors.name}>
          <MainInput
            register={register("name", { required: "Обязательное поле" })}
          />
        </BaseInput>

        <BaseInput label="ОПИСАНИЕ" error={errors.description}>
          <MainTextArea
            register={register("description", {
              required: "Обязательное поле",
            })}
          />
        </BaseInput>

        <MainCheckBox
          label="Срочно"
          register={register("urgent")}
          value={!!category?.urgent}
        />

        <MainCheckBox label="Активный" register={register("status")} />

        <button type="submit" className="btn btn-success btn-fill">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default ShowCategory;
