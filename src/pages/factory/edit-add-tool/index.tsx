import { useLocation, useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import BaseInputs from "@/components/BaseInputs";
import { useTranslation } from "react-i18next";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import AddCategory from "./addCategory";
import MainDropZone from "@/components/MainDropZone";
import {
  factoryToolMutation,
  getInvFactoryTool,
  getInvFactoryTools,
} from "@/hooks/factory";
import Loading from "@/components/Loader";
import MainInput from "@/components/BaseInputs/MainInput";

const EditInventoryFactoryProd = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const goBack = () =>
    navigate(`/products-ierarch-factory${state?.search ? state.search : ""}`, {
      state,
    });
  const [uploadedImg, $uploadedImg] = useState<string[]>([]);

  const {
    data: tool,
    refetch,
    isLoading,
  } = getInvFactoryTool({ id: Number(id) });

  const { isLoading: toolsFetching, refetch: toolsrefetch } =
    getInvFactoryTools({
      ...(!!state?.parent_id && { parent_id: state?.parent_id }),
      enabled: false,
    });

  const { mutate, isPending } = factoryToolMutation();
  const { register, handleSubmit, getValues, reset } = useForm();

  const onSubmit = () => {
    const { status, factory_ftime } = getValues();

    mutate(
      {
        id: Number(id),
        name: tool?.name,
        status: Number(status),
        category_id: tool?.category_id,
        factory_ftime: !!factory_ftime ? +factory_ftime : tool?.factory_ftime,
        file: !!uploadedImg.length ? uploadedImg.at(-1) : null,
      },
      {
        onSuccess: async () => {
          refetch();
          await toolsrefetch();
          goBack();
          successToast("successfully updated");
          $uploadedImg([]);
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    if (tool?.file) $uploadedImg([tool?.file]);
    reset({
      status: !!tool?.status,
      factory_ftime: tool?.factory_ftime,
    });
  }, [tool]);

  if (isPending || isLoading || toolsFetching) return <Loading />;

  return (
    <Card>
      <Header title={`${t("edit")} ${tool?.name}`}>
        <button className="btn btn-primary" onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <AddCategory />
        <BaseInputs label="status">
          <MainCheckBox label={"active"} register={register("status")} />
        </BaseInputs>

        <BaseInputs label="deadline_in_hours">
          <MainInput
            type="number"
            register={register("factory_ftime")}
            placeholder={t("deadline_in_hours")}
          />
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

export default EditInventoryFactoryProd;
