import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { successToast } from "@/utils/toast";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import useCars from "@/hooks/useCars";
import carsMutation from "@/hooks/mutation/cars";

const EditAddLogCars = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { refetch: carsRefetch } = useCars({ enabled: false });
  const { mutate: postCars } = carsMutation();

  const { data, refetch: carRefetch } = useCars({
    id: Number(id),
    enabled: !!id,
  });

  const car = data?.[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = () => {
    const { car_model, car_number, status } = getValues();
    postCars(
      { name: car_model, id: Number(id), status, number: car_number },
      {
        onSuccess: () => {
          successToast("success");
          goBack();
          carsRefetch();
          if (!!id) carRefetch();
        },
      }
    );
  };

  useEffect(() => {
    if (id && car) {
      reset({
        car_model: car.name,
        status: car.status,
        car_number: car.number,
      });
    }
  }, [car, id]);

  return (
    <Card>
      <Header title={!id ? "Добавить" : `Изменить роль №${id}`}>
        <button className="btn btn-success btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        <BaseInputs label="Модель машины" error={errors.name}>
          <MainInput
            register={register("car_model", { required: "Обязательное поле" })}
          />
        </BaseInputs>

        <BaseInputs label="Номер" error={errors.name}>
          <MainInput
            register={register("car_number", { required: "Обязательное поле" })}
          />
        </BaseInputs>

        <BaseInputs label="статус">
          <MainCheckBox label="Активный" register={register("status")} />
        </BaseInputs>

        <button type="submit" className="btn btn-success btn-fill">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default EditAddLogCars;
