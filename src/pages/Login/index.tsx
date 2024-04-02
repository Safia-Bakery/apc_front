import { useForm } from "react-hook-form";
import styles from "./index.module.scss";
import cl from "classnames";
import loginMutation from "@/hooks/mutation/loginMutation";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { linkSelector, loginHandler, tokenSelector } from "reducers/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useToken from "@/hooks/useToken";
import { successToast } from "@/utils/toast";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import Loading from "@/components/Loader";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector(tokenSelector);
  const { refetch, isFetching: tokenLoading } = useToken({});
  const [error, $error] = useState(false);
  const savedLink = useAppSelector(linkSelector);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const { mutate, isPending } = loginMutation();

  const onSubmit = () => {
    const { username, password } = getValues();

    mutate(
      { username, password },
      {
        onSuccess: (data) => {
          dispatch(loginHandler(data.access_token));
          refetch();
          successToast(t("welcome"));
          if (error) $error(false);
        },
        onError: () => $error(true),
      }
    );
  };

  useEffect(() => {
    if (token) navigate(savedLink);
  }, [token]);

  if (isPending || tokenLoading) return <Loading />;

  return (
    <div className={styles.login_wrap}>
      <div className={styles.overlay} />
      <div className={cl(styles.content, "shadow rounded")}>
        <h3 className="text-center mb-3">{t("auth")}</h3>
        <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
          <BaseInput className="mb-0" error={errors.username}>
            <MainInput
              register={register("username", { required: "required" })}
              autoFocus
              className={styles.input}
              placeholder={t("login")}
            />
          </BaseInput>
          <BaseInput className="mb-0" error={errors.password}>
            <MainInput
              register={register("password", { required: "required" })}
              type="password"
              className={cl(styles.input, "mb-4")}
              placeholder={t("password")}
            />
            {error && <p className={styles.error}>{t("incorrect_username")}</p>}
          </BaseInput>

          <button type="submit" className="btn btn-primary   float-end">
            {t("login")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
