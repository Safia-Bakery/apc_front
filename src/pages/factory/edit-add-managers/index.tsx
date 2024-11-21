import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import BaseInputs from "@/components/BaseInputs";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import MainInput from "@/components/BaseInputs/MainInput";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import {
  factoryManagersMutation,
  getApcFactoryManager,
  getApcFactoryManagers,
} from "@/hooks/factory";

const EditAddFabricMaster = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const { mutate } = factoryManagersMutation();

  const {
    data: master,
    refetch,
    isLoading: brigadaLoading,
  } = getApcFactoryManager({
    id: Number(id),
    enabled: !!id,
  });

  const { refetch: mastersRefetch } = getApcFactoryManagers({
    enabled: false,
    page: 1,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = () => {
    const { name, description, status } = getValues();

    mutate(
      {
        status,
        description: description,
        name,
        ...(id && { id: Number(id) }),
      },
      {
        onSuccess: () => {
          mastersRefetch();
          goBack();
          successToast(!!id ? "successfully updated" : "successfully created");
          if (!!id) {
            refetch();
          }
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    if (id && master) {
      reset({
        name: master?.name,
        description: master?.description,
        status: !!master?.status,
      });
    }
  }, [master, id]);

  if (!!id && brigadaLoading) return <Loading />;

  return (
    <Card>
      <Header title={!id ? t("add") : `Изменить Мастер №${id}`}>
        <button className="btn btn-primary" onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <BaseInputs
            label="НАЗВАНИЕ МАСТЕРА"
            error={errors.name}
            className="w-full"
          >
            <MainInput
              register={register("name", {
                required: t("required_field"),
              })}
            />
          </BaseInputs>
        </div>

        <BaseInputs label="description">
          <MainTextArea register={register("description")} />
        </BaseInputs>

        <MainCheckBox label={"active"} register={register("status")} />

        <button type="submit" className="btn btn-success">
          {t("save")}
        </button>
      </form>
    </Card>
  );
};

export default EditAddFabricMaster;
