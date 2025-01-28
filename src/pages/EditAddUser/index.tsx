import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import userMutation from "@/hooks/mutation/userMutation";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import useUser from "@/hooks/useUser";
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
import { useTranslation } from "react-i18next";
import InputMask from "@/components/BaseInputs/InputMask";

const EditAddUser = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const ref = useRef<any>(null);
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const { data: roles } = useRoles({});
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
        sphere_status: sphere_status ? Sphere.fabric : Sphere.retail,
        ...(fixedString(phone_number).length > 5 && {
          phone_number: fixedString(phone_number),
        }),
        ...(!!email && { email }),
        ...(brigada_id && { brigada_id }),
        ...(!!telegram_id && { telegram_id }),
        ...(!!id && { user_id: Number(id) }),
      },
      {
        onSuccess: () => {
          navigate(!client ? "/users" : "/clients");
          successToast(!!id ? "successfully updated" : "successfully created");
          if (!!id) userRefetch();
        },
        onError: (e) => errorToast(e.message),
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
      <Header title={!id ? t("add") : `${t("edit_user")} №${id}`}>
        <button className="btn btn-primary  " onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <BaseInputs label="full_name" error={errors.full_name}>
              <MainInput
                register={register("full_name", {
                  required: t("required_field"),
                })}
              />
            </BaseInputs>

            <BaseInputs label="login" error={errors.username}>
              <MainInput
                register={register("username", {
                  required: t("required_field"),
                })}
              />
            </BaseInputs>
            <BaseInputs label="phone" error={errors.phone_number}>
              <InputMask
                className="form-control mb-2"
                mask="(999-99)-999-99-99"
                defaultValue={"998"}
                {...register("phone_number", {
                  required: "required",
                })}
              />
            </BaseInputs>

            <BaseInputs label="sphere">
              <MainRadioBtns
                onChange={(e) => $sphere_status(e)}
                value={sphere_status}
                values={[
                  { id: 0, name: t("retail") },
                  { id: 1, name: t("fabric") },
                ]}
              />
            </BaseInputs>
            {!!id && (
              <BaseInputs label="telegram_id" error={errors.telegram_id}>
                <MainInput register={register("telegram_id")} />
              </BaseInputs>
            )}
          </div>
          <div className="col-md-6">
            <BaseInput label="role" error={errors.department}>
              <MainSelect values={roles} register={register("group_id")} />
            </BaseInput>
            <BaseInput error={errors.password} label="password">
              <MainInput
                type={"password"}
                register={register("password", {
                  required: t("required_field"),
                  minLength: {
                    value: 6,
                    message: t("six_symbols_required"),
                  },
                })}
              />
            </BaseInput>

            <BaseInput label="E-MAIL">
              <MainInput register={register("email")} />
            </BaseInput>

            <BaseInput label="status">
              <MainCheckBox label={"active"} register={register("status")} />
            </BaseInput>
          </div>
        </div>
        <BaseInput label="description">
          <MainTextArea register={register("description")} />
        </BaseInput>

        <button type="submit" className="btn btn-success   mt-3">
          {t("save")}
        </button>
      </form>
    </Card>
  );
};

export default EditAddUser;
