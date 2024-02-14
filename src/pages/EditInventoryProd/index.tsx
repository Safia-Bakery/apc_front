import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { errorToast, successToast } from "@/utils/toast";
import MainInput from "@/components/BaseInputs/MainInput";
import BaseInputs from "@/components/BaseInputs";
import updateToolsMutation from "@/hooks/mutation/updateTools";
import useTools from "@/hooks/useTools";
import { useTranslation } from "react-i18next";

const EditInventoryProd = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const { data } = useTools({ id });
  const tool = data?.items?.[0];

  const { mutate } = updateToolsMutation();

  const onSubmit = () => {
    const { min_amount, max_amount, deadline } = getValues();

    mutate(
      {
        id: Number(id),
        min_amount,
        max_amount,
        ftime: deadline,
      },
      {
        onSuccess: () => {
          goBack();
          successToast("successfully updated");
        },
        onError: (e: any) => errorToast(e.message),
      }
    );
  };
  const { register, handleSubmit, getValues, reset } = useForm();

  useEffect(() => {
    reset({
      min_amount: tool?.min_amount,
      max_amount: tool?.max_amount,
      deadline: tool?.ftime,
    });
  }, [tool]);

  // useEffect(() => {
  //   toolRefetch();
  // }, []);

  return (
    <Card>
      <Header title={`Изменить ${tool?.name}`}>
        <button className="btn btn-primary" onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <BaseInputs label="Минимум">
          <MainInput register={register("min_amount")} />
        </BaseInputs>
        <BaseInputs label="Максимум">
          <MainInput register={register("max_amount")} />
        </BaseInputs>
        <BaseInputs label="Дедлайн(в часах)">
          <MainInput register={register("deadline")} />
        </BaseInputs>

        <button type="submit" className="btn btn-success mt-3">
          {t("save")}
        </button>
      </form>
    </Card>
  );
};

export default EditInventoryProd;
