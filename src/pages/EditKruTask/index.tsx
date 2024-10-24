import { useEffect } from "react";
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

const EditKruTask = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate, isPending } = editAddKruCategoryMutation();
  const { refetch } = useKruCategories({ enabled: false });
  const { register, reset, getValues, handleSubmit } = useForm();
  const { data: category, isLoading } = useKruCategory({
    id: Number(id),
    enabled: !!id,
  });

  const onSubmit = () => {
    const { name } = getValues();
    mutate(
      { name, ...(!!id && { id: Number(id) }) },
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
    if (category && !!id) reset({ name: category?.name });
  }, [category, id]);
  if (isLoading || isPending) return <Loading />;
  return (
    <Card>
      <Header title={!id ? t("add") : `${t("edit_category")} №${id}`}>
        <button onClick={() => navigate(-1)} className="btn btn-primary">
          {t("back")}
        </button>
      </Header>

      <form
        className="table-responsive  content"
        onSubmit={handleSubmit(onSubmit)}
      >
        <BaseInputs label={"name_in_table"}>
          <MainInput
            placeholder={t("name_in_table")}
            register={register("name", { required: t("required_field") })}
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
