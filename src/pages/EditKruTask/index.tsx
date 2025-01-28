import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  editAddKruCategoryMutation,
  useKruCategories,
  useKruCategory,
} from "@/hooks/kru.ts";
import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loader";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput.tsx";
import { useForm } from "react-hook-form";
import successToast from "@/utils/successToast.ts";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import dayjs, { Dayjs } from "dayjs";
import { TimePicker } from "antd";
import MainSelect from "@/components/BaseInputs/MainSelect";

const EditKruTask = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate, isPending } = editAddKruCategoryMutation();
  const {
    refetch,
    data: categories,
    isLoading: categoriesLoading,
  } = useKruCategories({ page: 1 });
  const [start_time, $start_time] = useState<Dayjs | null>();
  const [end_time, $end_time] = useState<Dayjs | null>();

  const handleStartTime = (time: Dayjs | null) => {
    $start_time(time);
  };

  const handleEndTime = (time: Dayjs | null) => {
    $end_time(time);
  };

  const {
    register,
    reset,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { data: category, isLoading } = useKruCategory({
    id: Number(id),
    enabled: !!id,
  });

  const onSubmit = () => {
    const { name, parent, description } = getValues();
    mutate(
      {
        name,
        parent,
        description,
        ...(!!id && { id: Number(id) }),
        ...(!!start_time && { start_time: start_time?.format("HH:mm") }),
        ...(!!end_time && { end_time: end_time?.format("HH:mm") }),
      },
      {
        onSuccess: () => {
          refetch();
          successToast("success");
          navigate("/kru-tasks");
        },
      }
    );
  };

  useEffect(() => {
    if (category && !!id && categories?.items?.length) {
      if (!!category.end_time) $end_time(dayjs(category.end_time, "HH:mm"));
      if (!!category.start_time)
        $start_time(dayjs(category.start_time, "HH:mm"));
      reset({
        name: category?.name,
        description: category.description,
        parent: category.parent,
      });
    }
  }, [category, id, categories]);

  if (isLoading || isPending || categoriesLoading) return <Loading />;

  return (
    <Card>
      <Header title={!id ? t("add") : `${t("edit_category")} №${id}`}>
        <button onClick={() => navigate(-1)} className="btn btn-primary">
          {t("back")}
        </button>
      </Header>

      <form
        className="table-responsive content"
        onSubmit={handleSubmit(onSubmit)}
      >
        <BaseInputs label={"name_in_table"} error={errors?.name}>
          <MainInput
            placeholder={t("name_in_table")}
            register={register("name", { required: t("required_field") })}
          />
        </BaseInputs>
        <BaseInputs label={"parent"}>
          <MainSelect
            values={categories?.items}
            register={register("parent")}
          />
        </BaseInputs>
        <BaseInputs label={"description"}>
          <MainTextArea
            placeholder={t("description")}
            register={register("description")}
          />
        </BaseInputs>
        <BaseInputs label={"start_time"}>
          <TimePicker
            className="flex"
            value={start_time}
            onChange={handleStartTime}
            format="HH:mm"
          />
        </BaseInputs>
        <BaseInputs label={"end_time"}>
          <TimePicker
            className="flex"
            value={end_time}
            onChange={handleEndTime}
            format="HH:mm"
          />
        </BaseInputs>

        <button type={"submit"} className="btn btn-success">
          {t("send")}
        </button>
      </form>
    </Card>
  );
};

export default EditKruTask;
