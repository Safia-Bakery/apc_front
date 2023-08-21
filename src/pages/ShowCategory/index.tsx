import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import useCategory from "src/hooks/useCategory";
import { useEffect, useMemo } from "react";
import categoryMutation from "src/hooks/mutation/categoryMutation";
import useCategories from "src/hooks/useCategories";
import { successToast } from "src/utils/toast";
import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainTextArea from "src/components/BaseInputs/MainTextArea";
import MainCheckBox from "src/components/BaseInputs/MainCheckBox";
import useQueryString from "src/hooks/useQueryString";
import {
  Departments,
  MarketingSubDep,
  MarketingSubDepRu,
} from "src/utils/types";
import MainSelect from "src/components/BaseInputs/MainSelect";

const ShowCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const sub_id = useQueryString("sub_id");
  const dep = useQueryString("dep");
  const goBack = () => navigate(-1);
  const { refetch: categoryRefetch } = useCategories({
    enabled: false,
    page: 1,
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
  } = useForm();

  const onSubmit = () => {
    const { name, description, urgent, status, sub_id } = getValues();
    mutate(
      {
        name,
        description,
        status,
        urgent,
        department: Number(dep),
        ...(id && { id: +id }),
        ...(!!sub_id && { sub_id: +sub_id }),
      },
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
        sub_id: Number(category?.sub_id),
      });
    }
  }, [category, reset]);

  let renderDepartment;

  if (Number(dep) === Departments.marketing) {
    renderDepartment = (
      <>
        <BaseInput label="ОТДЕЛ" error={errors.name}>
          <MainSelect
            register={register("sub_id", { required: "Обязательное поле" })}
            values={MarketingSubDepRu}
          />
        </BaseInput>
        <BaseInput label="НАИМЕНОВАНИЕ" error={errors.name}>
          <MainInput
            register={register("name", { required: "Обязательное поле" })}
          />
        </BaseInput>
      </>
    );
  } else {
    renderDepartment = (
      <BaseInput label="НАИМЕНОВАНИЕ" error={errors.name}>
        <MainInput
          register={register("name", { required: "Обязательное поле" })}
        />
      </BaseInput>
    );
  }

  if (isLoading && !!id) return;

  return (
    <Card>
      <Header title={!id ? "Добавить" : `Изменить категорие №${id}`}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>
      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        {renderDepartment}

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
