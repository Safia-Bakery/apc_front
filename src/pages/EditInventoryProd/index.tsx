import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import MainInput from "@/components/BaseInputs/MainInput";
import BaseInputs from "@/components/BaseInputs";
import updateToolsMutation from "@/hooks/mutation/updateTools";
import useTools from "@/hooks/useTools";
import { useTranslation } from "react-i18next";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import MainSelect from "@/components/BaseInputs/MainSelect";
import AddCategory from "./addCategory";
import MainDropZone from "@/components/MainDropZone";
import Loading from "@/components/Loader";
import { useToolsRetail } from "@/hooks/useToolsIerarch";
import { useInvTools } from "@/hooks/useInvTools";

const SelectDates = [
  { id: 24, name: "one_day" },
  { id: 48, name: "two_days" },
];

const EditInventoryProd = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const goBack = () =>
    navigate(`/products-ierarch${state.search ? state.search : ""}`, { state });
  const [uploadedImg, $uploadedImg] = useState<string[]>([]);

  const { refetch: toolsRefetch } = useInvTools({
    ...(!!state?.page && { page: +state?.page }),
    ...(!!state?.category_id && { category_id: +state?.category_id }),
    enabled: false,
  });

  const { data, refetch, isLoading } = useTools({ id });
  const { isLoading: toolsFetching, refetch: toolsrefetch } = useToolsRetail({
    ...(!!state?.parent_id && { parent_id: state?.parent_id }),
    enabled: false,
  });
  const tool = data?.items?.[0];

  const { mutate } = updateToolsMutation();
  const { register, handleSubmit, getValues, reset } = useForm();

  const onSubmit = () => {
    const {
      min_amount,
      max_amount,
      deadline,
      status,
      confirmation,
      confirmer,
    } = getValues();

    mutate(
      {
        id: Number(id),
        min_amount,
        max_amount,
        ftime: deadline,
        status: Number(status),
        confirmation: !!Number(confirmation),
        confirmer: Number(confirmer),
        image: !!uploadedImg.length ? uploadedImg.at(-1) : null,
      },
      {
        onSuccess: async () => {
          refetch();

          if (state?.category_id) {
            toolsRefetch();
            navigate(-1);
          }
          if (!state?.category_id) {
            await toolsrefetch();
            goBack();
          }
          successToast("successfully updated");
          $uploadedImg([]);
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    if (tool?.image) $uploadedImg([tool?.image]);
    reset({
      min_amount: tool?.min_amount,
      max_amount: tool?.max_amount,
      deadline: tool?.ftime,
      status: !!tool?.status,
      confirmation: !!tool?.confirmation,
      confirmer: tool?.confirmer,
    });
  }, [tool]);

  if (toolsFetching || isLoading) return <Loading />;

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
        <AddCategory />
        <BaseInputs label="Кто будет подтверждать">
          <MainInput
            register={register("confirmer")}
            placeholder={"Введите телеграм ID"}
            type="nuber"
          />
        </BaseInputs>
        <BaseInputs>
          <MainCheckBox
            label={"Будет ли товар подтверждаться"}
            register={register("confirmation")}
          />
        </BaseInputs>
        <BaseInputs label="status">
          <MainCheckBox label={"active"} register={register("status")} />
        </BaseInputs>

        <BaseInputs label="upload_photo" className="relative flex flex-col">
          <MainDropZone setData={$uploadedImg} defaultFiles={uploadedImg} />
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
