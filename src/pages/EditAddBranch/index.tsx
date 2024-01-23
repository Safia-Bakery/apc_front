import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useBranch from "@/hooks/useBranch";
import branchMutation from "@/hooks/mutation/branchMutation";
import useBranches from "@/hooks/useBranches";
import { errorToast, successToast } from "@/utils/toast";
import MainInput from "@/components/BaseInputs/MainInput";
import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import branchDepartmentMutation from "@/hooks/mutation/branchDepartment";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import { Departments } from "@/utils/types";
import MainRadioBtns from "@/components/BaseInputs/MainRadioBtns";

const EditAddBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const { mutate } = branchMutation();
  const { mutate: depMutation } = branchDepartmentMutation();
  const [is_fabrica, $is_fabrica] = useState<boolean>();

  const { data: branch, refetch } = useBranch({ id: id! });
  const { refetch: branchesRefetch } = useBranches({
    enabled: false,
    origin: 0,
  });

  useEffect(() => {
    if (!!id && branch) {
      if (branch.is_fabrica !== null) $is_fabrica(!!branch.is_fabrica);
      reset({
        name: branch?.name,
        region: branch?.country,
        lat: branch?.latitude,
        lng: branch?.longtitude,
        status: !!branch?.status,
      });
    }
  }, [branch, id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const handleDep = (body: { origin: number; id: string }) => {
    if (!!body.origin) {
      depMutation(body, {
        onSuccess: () => {
          refetch();
          successToast("Успешно изменено");
        },
        onError: (e: any) => errorToast(e.message),
      });
    }
  };

  const onSubmit = () => {
    const { lat, lng, region, name, status } = getValues();

    mutate(
      {
        latitude: Number(lat),
        longtitude: Number(lng),
        country: region,
        name,
        status,
        is_fabrica,
        ...(!!id && { id }),
      },
      {
        onSuccess: () => {
          branchesRefetch();
          refetch();
          successToast(!!id ? "successfully updated" : "successfully created");
          navigate("/branches");
        },
        onError: (e: any) => errorToast(e.message),
      }
    );
  };

  const findName = (origin: number) => {
    return branch?.fillial_department.find((item) => item.origin === origin)
      ?.id;
  };
  return (
    <Card>
      <Header title={!id ? "Добавить" : `Изменить филиал ${branch?.name}`}>
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

        <BaseInputs label="РЕГИОН" error={errors.region}>
          <MainInput
            register={register("region", { required: "Обязательное поле" })}
            disabled={!!id}
          />
        </BaseInputs>

        <BaseInputs label="ШИРОТА">
          <MainInput register={register("lat")} />
        </BaseInputs>

        <BaseInputs label="ДОЛГОТА">
          <MainInput register={register("lng")} />
        </BaseInputs>

        <BaseInputs label="Статус">
          <MainCheckBox label="Активный" register={register("status")} />
        </BaseInputs>

        <BaseInputs label="Сфера">
          <MainRadioBtns
            onChange={(e) => $is_fabrica(e)}
            value={is_fabrica}
            values={[
              { id: 0, name: "Розница" },
              { id: 1, name: "Фабрика" },
            ]}
          />
        </BaseInputs>
        <BaseInputs label={"АРС"}>
          <MainSelect
            onChange={(e) =>
              handleDep({ origin: Departments.apc, id: e.target.value })
            }
            value={findName(Departments.apc)}
            values={branch?.fillial_department}
          />
        </BaseInputs>
        <BaseInputs label={"Инвентарь"}>
          <MainSelect
            onChange={(e) =>
              handleDep({
                origin: Departments.inventory,
                id: e.target.value,
              })
            }
            value={findName(Departments.inventory)}
            values={branch?.fillial_department}
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
