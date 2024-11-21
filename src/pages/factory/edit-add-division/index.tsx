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
  factoryDivisionMutation,
  factoryManagersMutation,
  getApcFactoryDivision,
  getApcFactoryDivisions,
  getApcFactoryManager,
  getApcFactoryManagers,
} from "@/hooks/factory";
import MainSelect from "@/components/BaseInputs/MainSelect";

const EditAddFabricDivision = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const { mutate } = factoryDivisionMutation();

  const {
    data: division,
    refetch,
    isLoading: divisionLoading,
  } = getApcFactoryDivision({
    id: id!,
    enabled: !!id,
  });

  const { data: managers, isLoading: managersLoading } = getApcFactoryManagers({
    status: 1,
  });

  const { refetch: divisionsRefetch } = getApcFactoryDivisions({
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
    const { name, manager_id, status } = getValues();

    mutate(
      {
        status: Number(status),
        manager_id,
        name,
        ...(id && { id }),
      },
      {
        onSuccess: () => {
          divisionsRefetch();
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
    if (id && division && !!managers?.items?.length) {
      reset({
        name: division?.name,
        manager_id: division?.manager_id,
        status: !!division?.status,
      });
    }
  }, [division, id, managers]);

  if (managersLoading || (!!id && divisionLoading)) return <Loading />;

  return (
    <Card>
      <Header title={!id ? t("add") : `${t("edit_branch")} №${id}`}>
        <button className="btn btn-primary" onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <BaseInputs
            label="name_in_table"
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

        <BaseInputs label="master" error={errors.manager_id}>
          <MainSelect
            register={register("manager_id", {
              required: t("required_field"),
            })}
            values={managers?.items}
          />
        </BaseInputs>

        <MainCheckBox label={"active"} register={register("status")} />

        <button type="submit" className="btn btn-success">
          {t("save")}
        </button>
      </form>
    </Card>
  );
};

export default EditAddFabricDivision;
