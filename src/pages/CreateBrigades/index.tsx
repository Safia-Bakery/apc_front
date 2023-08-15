import { useNavigate, useParams } from "react-router-dom";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { errorToast, successToast } from "src/utils/toast";
import useBrigadas from "src/hooks/useBrigadas";
import useBrigada from "src/hooks/useBrigada";
import brigadaMutation from "src/hooks/mutation/brigadaMutation";
import useUsersForBrigada from "src/hooks/useUsersForBrigada";
import BaseInputs from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import MainTextArea from "src/components/BaseInputs/MainTextArea";
import MainInput from "src/components/BaseInputs/MainInput";
import MainCheckBox from "src/components/BaseInputs/MainCheckBox";

const CreateBrigades = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { refetch: brigadasRefetch } = useBrigadas({ enabled: false });
  const { mutate } = brigadaMutation();
  const { refetch: usersRefetch, data: users } = useUsersForBrigada({
    id: Number(id),
    enabled: !!id,
  });
  const { data: brigada, refetch: brigadaRefetch } = useBrigada({
    id: Number(id),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  useEffect(() => {
    if (id && brigada) {
      reset({
        brigada_name: brigada?.name,
        brigada_description: brigada?.description,
        brigadir: brigada?.user?.[0]?.id,
        status: !!brigada.status,
      });
    }
  }, [brigada, id, users]);

  const onSubmit = () => {
    const { brigada_name, brigada_description, brigadir, status } = getValues();

    mutate(
      {
        status,
        users: [brigadir],
        description: brigada_description,
        name: brigada_name,
        ...(id && { id: Number(id) }),
      },
      {
        onSuccess: () => {
          brigadasRefetch();
          brigadaRefetch();
          successToast(!!id ? "successfully updated" : "successfully created");
          navigate("/brigades");
          if (!!id) usersRefetch();
        },
        onError: (e: Error) => errorToast(e.message),
      }
    );
  };
  return (
    <Card>
      <Header title={!id ? "Добавить" : `Изменить бригада №${id}`}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <BaseInputs label="Название бригады" error={errors.brigada_name}>
            <MainInput
              register={register("brigada_name", {
                required: "Обязательное поле",
              })}
            />
          </BaseInputs>
        </div>

        {!!id && (
          <BaseInputs label="Выберите бригадира" error={errors.brigadir}>
            <MainSelect
              register={register("brigadir", { required: "Обязательное поле" })}
            >
              <option value={undefined}></option>
              {users?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.username}
                </option>
              ))}
            </MainSelect>
          </BaseInputs>
        )}
        <BaseInputs label="ОПИСАНИЕ">
          <MainTextArea register={register("brigada_description")} />
        </BaseInputs>

        <MainCheckBox label="Активный" register={register("status")} />

        <button type="submit" className="btn btn-success btn-fill">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default CreateBrigades;
