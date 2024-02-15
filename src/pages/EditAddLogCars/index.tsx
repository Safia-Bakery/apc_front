import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { errorToast, successToast } from "@/utils/toast";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import useCars from "@/hooks/useCars";
import carsMutation from "@/hooks/mutation/cars";
import { useTranslation } from "react-i18next";

const EditAddLogCars = () => {
  const { t } = useTranslation();
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
        onError: (e: any) => errorToast(e.message),
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
      <Header title={!id ? t("add") : `${t("edit_role")} №${id}`}>
        <button className="btn btn-success btn-fill" onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        <BaseInputs label="car_model" error={errors.name}>
          <MainInput
            register={register("car_model", { required: t("required_field") })}
          />
        </BaseInputs>

        <BaseInputs label="num" error={errors.name}>
          <MainInput
            register={register("car_number", { required: t("required_field") })}
          />
        </BaseInputs>

        <BaseInputs label="status">
          <MainCheckBox label={"active"} register={register("status")} />
        </BaseInputs>

        <button type="submit" className="btn btn-success btn-fill">
          {t("save")}
        </button>
      </form>
    </Card>
  );
};

export default EditAddLogCars;
