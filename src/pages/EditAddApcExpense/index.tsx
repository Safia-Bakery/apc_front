import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { errorToast, successToast } from "@/utils/toast";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import { useTranslation } from "react-i18next";
import useExpenseApcTypes from "@/hooks/useExpenseApcTypes";
import useExpensesApc from "@/hooks/useExpensesApc";
import MainSelect from "@/components/BaseInputs/MainSelect";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import apcExpensesMutation from "@/hooks/mutation/apcExpenses";

const EditAddApcExpenseTypes = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { mutate: postexpense } = apcExpensesMutation();

  const { data: categories } = useExpenseApcTypes({ status: 1 });

  const { data, refetch: expenseRefetch } = useExpensesApc({
    id: Number(id),
    enabled: !!id,
  });

  const expense = data?.[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = () => {
    const { amount, description, from_date, to_date, expensetype_id, status } =
      getValues();
    postexpense(
      {
        amount,
        description,
        from_date,
        to_date,
        expensetype_id,
        status,
        id: Number(id),
      },
      {
        onSuccess: () => {
          successToast("success");
          goBack();
          if (!!id) expenseRefetch();
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    if (id && expense) {
      reset({
        amount: expense.amount,
        description: expense.description,
        from_date: expense.from_date,
        to_date: expense.to_date,
        expensetype_id: expense.expensetype_id,
        status: !!expense.status,
      });
    }
  }, [expense, id]);

  return (
    <Card>
      <Header title={!id ? t("add") : `${t("edit_expense")} №${id}`}>
        <button className="btn btn-success btn-fill" onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        <BaseInputs label="category" error={errors.expensetype_id}>
          <MainSelect
            values={categories}
            register={register("expensetype_id", {
              required: t("required_field"),
            })}
          />
        </BaseInputs>
        <BaseInputs label="summ" error={errors.amount}>
          <MainInput
            type="number"
            register={register("amount", { required: t("required_field") })}
          />
        </BaseInputs>

        <BaseInputs label="from_date" error={errors.from_date}>
          <MainInput
            type="date"
            register={register("from_date", { required: t("required_field") })}
          />
        </BaseInputs>

        <BaseInputs label="to_date" error={errors.to_date}>
          <MainInput
            type="date"
            register={register("to_date", { required: t("required_field") })}
          />
        </BaseInputs>
        <BaseInputs label="description">
          <MainTextArea register={register("description")} />
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

export default EditAddApcExpenseTypes;
