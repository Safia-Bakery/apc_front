import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useBranch from "src/hooks/useBranch";
import branchMutation from "src/hooks/mutation/branchMutation";
import useBranches from "src/hooks/useBranches";
import { successToast } from "src/utils/toast";
import MainInput from "src/components/BaseInputs/MainInput";
import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import branchDepartmentMutation from "src/hooks/mutation/branchDepartment";
import MainCheckBox from "src/components/BaseInputs/MainCheckBox";
import { Departments } from "src/utils/types";

const EditAddBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const { mutate } = branchMutation();
  const { mutate: depMutation } = branchDepartmentMutation();

  const { data: branch, refetch } = useBranch({ id: id! });
  const { refetch: branchesRefetch } = useBranches({
    enabled: false,
    origin: 0,
  });

  useEffect(() => {
    if (!!id && branch) {
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
        ...(!!id && { id }),
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

  const findName = (origin: number) => {
    return branch?.fillial_department.find((item) => item.origin === origin)
      ?.id;
  };
  return (
    <Card>
      <Header title={!id ? "Добавить" : `Изменить филиал №${id}`}>
        {/* <button
          className={`btn-${
            department ? "success" : "info"
          } btn btn-success btn-fill mr-3`}
          onClick={toggleDep}
        >
          Определить {!department ? "отдел" : "филлиал"}
        </button> */}
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

        <MainCheckBox label="Активный" register={register("status")} />

        <BaseInputs label={"APC"}>
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
