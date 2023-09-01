import { useNavigate, useParams } from "react-router-dom";
import Card from "src/components/Card";
import Header from "src/components/Header";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import userMutation from "src/hooks/mutation/userMutation";
import { successToast } from "src/utils/toast";
import useUsers from "src/hooks/useUsers";
import useUser from "src/hooks/useUser";
import InputMask from "react-input-mask";
import BaseInput from "src/components/BaseInputs";
import MainSelect from "src/components/BaseInputs/MainSelect";
import MainInput from "src/components/BaseInputs/MainInput";
import BaseInputs from "src/components/BaseInputs";
import MainCheckBox from "src/components/BaseInputs/MainCheckBox";
import MainRadioBtns from "src/components/BaseInputs/MainRadioBtns";

const EditClient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { refetch: usersRefetch } = useUsers({
    enabled: false,
    page: 1,
    size: 50,
    position: false,
  });
  const { data: user, refetch: userRefetch } = useUser({ id: Number(id) });
  const [sphere_status, $sphere_status] = useState<boolean>();

  const { mutate } = userMutation();

  const onSubmit = () => {
    const { status } = getValues();

    mutate(
      {
        status: !status ? 2 : 0,
        sphere_status: !sphere_status ? 2 : 1,
        ...(!!id && { user_id: Number(id) }),
      },
      {
        onSuccess: (data: any) => {
          if (data.status === 200) {
            usersRefetch();
            navigate(`/clients?client=true`);
            successToast(
              !!id ? "successfully updated" : "successfully created"
            );
            if (!!id) userRefetch();
          }
        },
      }
    );
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  useEffect(() => {
    if (id && user) {
      $sphere_status(user.sphere_status === 1);
      reset({
        full_name: user.full_name,
        group_id: user.group?.id,
        email: user.email,
        phone_number: user.phone_number,
        telegram_id: user?.telegram_id,
        status: !user.status ? true : false,
      });
    }
  }, [user, id, getValues("phone_number")]);

  return (
    <Card>
      <Header title={!id ? "Добавить" : `Изменить пользователь №${id}`}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <BaseInputs label="ФИО" error={errors.full_name}>
              <MainInput
                disabled
                register={register("full_name", {
                  required: "Обязательное поле",
                })}
              />
            </BaseInputs>

            <BaseInputs label="ТЕЛЕФОН">
              <InputMask
                className="form-control mb-2"
                mask="(999-99)-999-99-99"
                disabled
                defaultValue={"998"}
                {...register("phone_number", {
                  required: "required",
                })}
              />
            </BaseInputs>

            <BaseInputs label="Сфера">
              <MainRadioBtns
                onChange={(e) => $sphere_status(e)}
                value={sphere_status}
                values={[
                  { id: 0, name: "Розница" },
                  { id: 1, name: "Фабрика" },
                ]}
              />
            </BaseInputs>
          </div>
          <div className="col-md-6">
            <BaseInput label="РОЛЬ" error={errors.department}>
              <MainSelect disabled register={register("group_id")} />
            </BaseInput>
            {!!id && (
              <BaseInputs label="Телеграм ID" error={errors.telegram_id}>
                <MainInput disabled register={register("telegram_id")} />
              </BaseInputs>
            )}

            <BaseInput label="статус">
              <MainCheckBox label="Активный" register={register("status")} />
            </BaseInput>
          </div>
        </div>

        <button type="submit" className="btn btn-success btn-fill mt-3">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default EditClient;
