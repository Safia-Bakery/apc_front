import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useBranch from "src/hooks/useBranch";
import branchMutation from "src/hooks/mutation/branchMutation";
import useBranches from "src/hooks/useBranches";
import { successToast } from "src/utils/toast";
import MainInput from "src/components/BaseInputs/MainInput";
import BaseInputs from "src/components/BaseInputs";
import { departments } from "src/utils/helpers";
import MainSelect from "src/components/BaseInputs/MainSelect";
import branchDepartmentMutation from "src/hooks/mutation/branchDepartment";
import MainCheckBox from "src/components/BaseInputs/MainCheckBox";

const EditAddBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const [department, $department] = useState<boolean>(false);

  const { mutate } = branchMutation();
  const { mutate: depMutation } = branchDepartmentMutation();

  const { data: branch, refetch } = useBranch({ id: id! });
  const { refetch: branchesRefetch } = useBranches({ enabled: false });

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
    depMutation(body, {
      onSuccess: () => {
        refetch();
        successToast("Успешно изменено");
      },
    });
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

  const toggleDep = () => $department((prev) => !prev);

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

        <BaseInputs label="ШИРОТА" error={errors.lat}>
          <MainInput
            register={register("lat", { required: "Обязательное поле" })}
          />
        </BaseInputs>

        <BaseInputs label="ДОЛГОТА" error={errors.lng}>
          <MainInput
            register={register("lng", { required: "Обязательное поле" })}
          />
        </BaseInputs>

        <MainCheckBox label="Активный" register={register("status")} />

        {branch?.fillial_department.map((item) => (
          <BaseInputs key={item.id} label={item.name}>
            <MainSelect
              onChange={(e) =>
                handleDep({ origin: Number(e.target.value), id: item.id })
              }
              value={item.origin}
              values={departments}
            />
          </BaseInputs>
        ))}
      </form>

      <button type="submit" className="btn btn-success btn-fill">
        Сохранить
      </button>
    </Card>
  );
};

export default EditAddBranch;
