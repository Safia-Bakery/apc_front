import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/Card";
import Header from "@/components/Header";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import userMutation from "@/hooks/mutation/userMutation";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import useUsers from "@/hooks/useUsers";
import useUser from "@/hooks/useUser";
import BaseInput from "@/components/BaseInputs";
import MainSelect from "@/components/BaseInputs/MainSelect";
import MainInput from "@/components/BaseInputs/MainInput";
import BaseInputs from "@/components/BaseInputs";
import MainCheckBox from "@/components/BaseInputs/MainCheckBox";
import MainRadioBtns from "@/components/BaseInputs/MainRadioBtns";
import { Sphere } from "@/utils/types";
import useRoles from "@/hooks/useRoles";
import { useTranslation } from "react-i18next";
import InputMask from "@/components/BaseInputs/InputMask";

const EditClient = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { data: roles } = useRoles({});
  const [phone_number, $phone_number] = useState<string>("");
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
    const { status, group_id } = getValues();

    mutate(
      {
        status: !status ? 2 : 0,
        group_id: !!group_id ? group_id : 0,
        sphere_status: sphere_status ? Sphere.fabric : Sphere.retail,
        ...(!!id && { user_id: Number(id) }),
      },
      {
        onSuccess: () => {
          usersRefetch();
          navigate(`/clients?client=true`);
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
      $phone_number(user.phone_number);
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
      <Header title={!id ? t("add") : `${t("edit_user")} №${id}`}>
        <button className="btn btn-primary  " onClick={goBack}>
          {t("back")}
        </button>
      </Header>

      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6">
            <BaseInputs label="ФИО" error={errors.full_name}>
              <MainInput
                disabled
                register={register("full_name", {
                  required: t("required_field"),
                })}
              />
            </BaseInputs>

            <BaseInputs label="phone">
              <InputMask
                className="form-control mb-2"
                mask="(999-99)-999-99-99"
                defaultValue={"998"}
                value={phone_number}
                onChange={(e) => $phone_number(e.target.value)}
                // {...register("phone_number", {
                //   required: "Обязательное поле",
                //   min: 9,
                // })}
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
          </div>
          <div className="col-md-6">
            <BaseInput label="role" error={errors.department}>
              <MainSelect values={roles} register={register("group_id")} />
            </BaseInput>
            {!!id && (
              <BaseInputs label="telegram_id" error={errors.telegram_id}>
                <MainInput disabled register={register("telegram_id")} />
              </BaseInputs>
            )}

            <BaseInput label="status">
              <MainCheckBox label={"active"} register={register("status")} />
            </BaseInput>
          </div>
        </div>

        <button type="submit" className="btn btn-success   mt-3">
          {t("save")}
        </button>
      </form>
    </Card>
  );
};

export default EditClient;
