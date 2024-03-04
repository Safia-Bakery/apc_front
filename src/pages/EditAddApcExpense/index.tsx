import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
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
import MainDatePicker from "@/components/BaseInputs/MainDatePicker";
import dayjs from "dayjs";
import { yearMonthDate } from "@/utils/keys";

const EditAddApcExpenseTypes = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { mutate: postexpense } = apcExpensesMutation();
  const [start, $start] = useState<Date>();
  const [end, $end] = useState<Date>();

  const handleDateStart = (event: Date) => $start(event);
  const handleDateEnd = (event: Date) => $end(event);

  const { data: categories } = useExpenseApcTypes({ status: 1 });

  const { data, refetch: expenseRefetch } = useExpensesApc({
    id: Number(id),
    enabled: !!id,
  });

  const expense = data?.items?.[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = () => {
    const { amount, description, expensetype_id, status } = getValues();
    postexpense(
      {
        amount,
        description,
        from_date: dayjs(start)!?.format(yearMonthDate),
        to_date: dayjs(end)!?.format(yearMonthDate),
        expensetype_id,
        status: !!status?.toString() ? status : 1,

        ...(id && { id: Number(id) }),
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
      $end(dayjs(expense.to_date).toDate());
      $start(dayjs(expense.from_date).toDate());
      reset({
        amount: expense.amount,
        description: expense.description,
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
          <MainDatePicker
            className="z-10"
            selected={!!start ? dayjs(start || undefined).toDate() : undefined}
            onChange={handleDateStart}
          />
        </BaseInputs>

        <BaseInputs label="to_date" error={errors.to_date}>
          <MainDatePicker
            className="z-10"
            selected={!!end ? dayjs(end || undefined).toDate() : undefined}
            onChange={handleDateEnd}
          />
        </BaseInputs>
        <BaseInputs label="description">
          <MainTextArea register={register("description")} />
        </BaseInputs>

        {!!id && (
          <BaseInputs label="status">
            <MainCheckBox label={"active"} register={register("status")} />
          </BaseInputs>
        )}

        <button type="submit" className="btn btn-success btn-fill">
          {t("save")}
        </button>
      </form>
    </Card>
  );
};

export default EditAddApcExpenseTypes;
