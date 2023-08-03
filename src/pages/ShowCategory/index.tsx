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
import MainRadioBtns from "src/components/BaseInputs/MainRadioBtns";
import { StatusName } from "src/utils/helpers";

const ShowCategory = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { refetch: categoryRefetch } = useCategories({ enabled: false });

  const { id } = useParams();

  const { data: category } = useCategory({ id: Number(id) });
  const [status, $status] = useState(0);
  const { mutate } = categoryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = () => {
    const { name, description, urgent } = getValues();
    mutate(
      { name, description, status, ...(id && { id: Number(id) }), urgent },
      {
        onSuccess: () => {
          categoryRefetch();
          successToast(!!id ? "successfully updated" : "successfully created");
          navigate("/categories");
        },
      }
    );
  };

  const handleStatus = (e: boolean) => $status(Number(e));

  useEffect(() => {
    if (category) {
      $status(category?.status);
      reset({
        name: category?.name,
        description: category?.description,
      });
    }
  }, [category, reset]);

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

        <div className="form-group d-flex align-items-center form-control">
          <label className="mb-0 mr-2">Срочно</label>
          <input
            type="checkbox"
            defaultChecked={!!category?.urgent}
            {...register("urgent")}
          />
        </div>

        <BaseInput label="СТАТУС">
          <MainRadioBtns
            value={!!status}
            values={StatusName}
            onChange={handleStatus}
          />
        </BaseInput>
        <button type="submit" className="btn btn-success btn-fill">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default ShowCategory;
