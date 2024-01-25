import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import userMutation from "@/hooks/mutation/userMutation";
import { errorToast, successToast } from "@/utils/toast";
import useUsers from "@/hooks/useUsers";
import useUser from "@/hooks/useUser";
import InputMask from "react-input-mask";
import { fixedString } from "@/utils/helpers";
import BaseInput from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import MainInput from "@/components/BaseInputs/MainInput";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import BaseInputs from "@/components/BaseInputs";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import useRoles from "@/hooks/useRoles";
import MainRadioBtns from "@/components/BaseInputs/MainRadioBtns";
import { Sphere } from "@/utils/types";
import useQueryString from "custom/useQueryString";

const EditAddUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const { data: roles } = useRoles({});
  const { refetch: usersRefetch } = useUsers({ enabled: false, page: 1 });
  const { data: user, refetch: userRefetch } = useUser({ id: Number(id) });
  const [sphere_status, $sphere_status] = useState<boolean>();
  const client = useQueryString("client");

  const { mutate } = userMutation();

  const onSubmit = () => {
    const {
      username,
      password,
      phone_number,
      full_name,
      email,
      group_id,
      telegram_id,
      brigada_id,
      status,
    } = getValues();

    mutate(
      {
        full_name,
        username,
        group_id,
        password,
        status: !status ? 2 : 0,
        phone_number: fixedString(phone_number),
        sphere_status: sphere_status ? Sphere.fabric : Sphere.retail,
        ...(!!email && { email }),
        ...(brigada_id && { brigada_id }),
        ...(!!telegram_id && { telegram_id }),
        ...(!!id && { user_id: Number(id) }),
      },
      {
        onSuccess: (data: any) => {
          if (data.status === 200) {
            usersRefetch();
            navigate(!client ? "/users" : "/clients");
            successToast(
              !!id ? "successfully updated" : "successfully created"
            );
            if (!!id) userRefetch();
          }
        },
        onError: (e: any) => errorToast(e.message),
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
      $sphere_status(user.sphere_status === Sphere.fabric);
      reset({
        full_name: user.full_name,
        username: user.username,
        group_id: user.group?.id,
        email: user.email,
        phone_number: user.phone_number,
        brigada_id: user.brigader?.id,
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
                register={register("full_name", {
                  required: "Обязательное поле",
                })}
              />
            </BaseInputs>

            <BaseInputs label="ЛОГИН" error={errors.username}>
              <MainInput
                register={register("username", {
                  required: "Обязательное поле",
                })}
              />
            </BaseInputs>
            <BaseInputs label="ТЕЛЕФОН">
              <InputMask
                className="form-control mb-2"
                mask="(999-99)-999-99-99"
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
            {!!id && (
              <BaseInputs label="Телеграм ID" error={errors.telegram_id}>
                <MainInput register={register("telegram_id")} />
              </BaseInputs>
            )}
          </div>
          <div className="col-md-6">
            <BaseInput label="РОЛЬ" error={errors.department}>
              <MainSelect values={roles} register={register("group_id")} />
            </BaseInput>
            <BaseInput error={errors.password} label="ПАРОЛЬ">
              <MainInput
                type={"password"}
                register={register("password", {
                  required: "Обязательное поле",
                  minLength: {
                    value: 6,
                    message: "Надо ввести минимум 6 символов",
                  },
                })}
              />
            </BaseInput>

            <BaseInput label="E-MAIL">
              <MainInput register={register("email")} />
            </BaseInput>

            <BaseInput label="статус">
              <MainCheckBox label="Активный" register={register("status")} />
            </BaseInput>
          </div>
        </div>
        <BaseInput label="ОПИСАНИЕ">
          <MainTextArea register={register("description")} />
        </BaseInput>

        <button type="submit" className="btn btn-success btn-fill mt-3">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default EditAddUser;
