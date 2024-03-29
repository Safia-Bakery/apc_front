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
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import MainSelect from "@/components/BaseInputs/MainSelect";

const SelectDates = [
  { id: 24, name: "one_day" },
  { id: 48, name: "two_days" },
];

const EditInventoryProd = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const { data, refetch } = useTools({ id });
  const tool = data?.items?.[0];

  const { mutate } = updateToolsMutation();

  const onSubmit = () => {
    const { min_amount, max_amount, deadline, status } = getValues();

    mutate(
      {
        id: Number(id),
        min_amount,
        max_amount,
        ftime: deadline,
        status: Number(status),
      },
      {
        onSuccess: () => {
          refetch();
          goBack();
          successToast("successfully updated");
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };
  const { register, handleSubmit, getValues, reset } = useForm();

  useEffect(() => {
    reset({
      min_amount: tool?.min_amount,
      max_amount: tool?.max_amount,
      deadline: tool?.ftime,
      status: !!tool?.status,
    });
  }, [tool]);

  return (
    <Card>
      <Header title={`${t("edit")} ${tool?.name}`}>
        <button className="btn btn-primary" onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <BaseInputs label="min">
          <MainInput register={register("min_amount")} />
        </BaseInputs>
        <BaseInputs label="max">
          <MainInput register={register("max_amount")} />
        </BaseInputs>
        <BaseInputs label="deadline_in_hours">
          <MainSelect values={SelectDates} register={register("deadline")} />
        </BaseInputs>
        <BaseInputs label="status">
          <MainCheckBox label={"active"} register={register("status")} />
        </BaseInputs>
        <div className="flex gap-2">
          <button type="submit" className="btn btn-success mt-3">
            {t("save")}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default EditInventoryProd;
