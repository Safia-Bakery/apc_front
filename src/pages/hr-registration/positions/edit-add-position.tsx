import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";
import {
  editAddPosition,
  getPosition,
  getPositions,
} from "@/hooks/hr-registration";

const EditAddHrPosition = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const { mutate, isPending } = editAddPosition();

  const {
    data: position,
    refetch,
    isLoading: positionLoading,
  } = getPosition({
    id: Number(id),
    enabled: !!id,
  });

  const { refetch: positionRefetch } = getPositions({
    enabled: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = () => {
    const { name, status } = getValues();

    mutate(
      {
        status: Number(status),
        name,
        ...(id && { id: Number(id) }),
      },
      {
        onSuccess: () => {
          positionRefetch();
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
    if (id && position) {
      reset({
        name: position?.name,
        status: !!position?.status,
      });
    }
  }, [position, id]);

  if ((!!id && positionLoading) || isPending) return <Loading />;

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

        <MainCheckBox label={"active"} register={register("status")} />

        <button type="submit" className="btn btn-success">
          {t("save")}
        </button>
      </form>
    </Card>
  );
};

export default EditAddHrPosition;
