import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { successToast } from "@/utils/toast";
import useBrigadas from "@/hooks/useBrigadas";
import useBrigada from "@/hooks/useBrigada";
import brigadaMutation from "@/hooks/mutation/brigadaMutation";
import useUsersForBrigada from "@/hooks/useUsersForBrigada";
import BaseInputs from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import MainInput from "@/components/BaseInputs/MainInput";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import useQueryString from "custom/useQueryString";

const CreateBrigades = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const sphere_status = useQueryString("sphere_status");
  const dep = useQueryString("dep");
  const { refetch: brigadasRefetch } = useBrigadas({
    enabled: false,
    ...(!!dep && { department: Number(dep) }),
    ...(!!sphere_status && { sphere_status: Number(sphere_status) }),
  });
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
        description: brigada_description,
        name: brigada_name,
        ...(id && { id: Number(id) }),
        ...(!!sphere_status && { sphere_status: Number(sphere_status) }),
        ...(!!dep && { department: Number(dep) }),
        ...(!!brigadir && { users: [brigadir] }),
      },
      {
        onSuccess: () => {
          brigadasRefetch();
          successToast(!!id ? "successfully updated" : "successfully created");
          navigate(-1);
          if (!!id) {
            brigadaRefetch();
            usersRefetch();
          }
        },
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
          <BaseInputs
            label="Название бригады"
            error={errors.brigada_name}
            className="w-full"
          >
            <MainInput
              register={register("brigada_name", {
                required: "Обязательное поле",
              })}
            />
          </BaseInputs>
        </div>

        {!!id && (
          <BaseInputs label="Выберите бригадира">
            <MainSelect register={register("brigadir")}>
              <option value={undefined}></option>
              {users
                ?.filter((item) => !!item.username)
                ?.map((item) => (
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
