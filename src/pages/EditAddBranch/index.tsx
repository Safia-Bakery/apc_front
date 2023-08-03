import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useState } from "react";
import cl from "classnames";
import useBranch from "src/hooks/useBranch";
import branchMutation from "src/hooks/mutation/branchMutation";
import useBranches from "src/hooks/useBranches";
import { successToast } from "src/utils/toast";
import MainInput from "src/components/BaseInputs/MainInput";
import BaseInputs from "src/components/BaseInputs";
import MainRadioBtns from "src/components/BaseInputs/MainRadioBtns";
import { StatusName } from "src/utils/helpers";

const EditAddBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const [status, $status] = useState(0);

  const { mutate } = branchMutation();

  const { data: branch, refetch } = useBranch({ id: Number(id) });
  const { refetch: branchesRefetch } = useBranches({ enabled: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const handleStatus = (e: boolean) => $status(Number(e));

  const onSubmit = () => {
    const { lat, lng, region, name } = getValues();
    mutate(
      {
        latitude: Number(lat),
        longtitude: Number(lng),
        country: region,
        name,
        status,
        ...(id && { id: Number(id) }),
      },
      {
        onSuccess: () => {
          branchesRefetch();
          refetch();
          successToast(!!id ? "successfully updated" : "successfully created");
          navigate("/branches");
        },
      }
    );
  };

  useEffect(() => {
    if (branch && id) {
      $status(branch?.status);
      reset({
        name: branch?.name,
        lat: branch.latitude,
        lng: branch.longtitude,
        region: branch.country,
      });
    }
  }, [branch]);
  return (
    <Card>
      <Header title={!id ? "Добавить" : `Изменить филиал №${id}`}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        <BaseInputs label="НАЗВАНИЕ" error={errors.name}>
          <MainInput
            register={register("name", { required: "Обязательное поле" })}
            disabled={!!id}
          />
        </BaseInputs>

        <BaseInputs label="НАЗВАНИЕ" error={errors.name}>
          <MainInput
            register={register("name", { required: "Обязательное поле" })}
            disabled={!!id}
          />
        </BaseInputs>

        <BaseInputs label="РЕГИОН" error={errors.region}>
          <MainInput
            register={register("region", { required: "Обязательное поле" })}
            disabled={!!id}
          />
        </BaseInputs>

        <BaseInputs label="ШИРОТА" error={errors.lat}>
          <MainInput
            register={register("lat", { required: "Обязательное поле" })}
          />
        </BaseInputs>

        <BaseInputs label="ДОЛГОТА" error={errors.lng}>
          <MainInput
            register={register("lng", { required: "Обязательное поле" })}
            disabled={!!id}
          />
        </BaseInputs>

        <BaseInputs label="СТАТУС">
          <MainRadioBtns
            values={StatusName}
            checked={status}
            onChange={handleStatus}
          />
        </BaseInputs>

        <button type="submit" className="btn btn-success btn-fill">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default EditAddBranch;
