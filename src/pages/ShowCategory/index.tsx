import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import useCategory from "src/hooks/useCategory";
import { FC, useEffect, useMemo } from "react";
import categoryMutation from "src/hooks/mutation/categoryMutation";
import useCategories from "src/hooks/useCategories";
import { successToast } from "src/utils/toast";
import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainTextArea from "src/components/BaseInputs/MainTextArea";
import MainCheckBox from "src/components/BaseInputs/MainCheckBox";
import { Departments, MarketingSubDepRu, Sphere } from "src/utils/types";
import MainSelect from "src/components/BaseInputs/MainSelect";

interface Props {
  sphere_status?: Sphere;
  dep?: Departments;
}

const ShowCategory: FC<Props> = ({ sphere_status, dep }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  const { refetch: categoryRefetch } = useCategories({
    enabled: false,
    page: 1,
    department: dep,
    ...(sphere_status && { sphere_status }),
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
        department: dep,
        sphere_status: sphere_status || Sphere.retail,
        ...(id && { id: +id }),
        ...(!!sub_id && { sub_id: +sub_id }),
      },
      {
        onSuccess: () => {
          categoryRefetch();
          successToast(!!id ? "successfully updated" : "successfully created");
          navigate(
            `/categories-${Departments[Number(dep)]}${
              !!sphere_status ? `-${Sphere[sphere_status]}` : ""
            }`
          );
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
    <Card className="overflow-hidden pb-3">
      <Header title={!id ? "Добавить" : `Изменить категорие №${id}`}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>
      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        {renderDepartment}

        <BaseInput label="ОПИСАНИЕ">
          <MainTextArea register={register("description")} />
        </BaseInput>

        <MainCheckBox
          label="Срочно"
          register={register("urgent")}
          value={!!category?.urgent}
        />

        <MainCheckBox label="Активный" register={register("status")} />

        <button type="submit" className="btn btn-success btn-fill float-end">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default ShowCategory;
