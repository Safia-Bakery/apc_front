import { useForm } from "react-hook-form";
import styles from "./index.module.scss";
import cl from "classnames";
import loginMutation from "src/hooks/mutation/loginMutation";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import { loginHandler, tokenSelector } from "src/redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useToken from "src/hooks/useToken";
import { successToast } from "src/utils/toast";

import BaseInput from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector(tokenSelector);
  const { refetch } = useToken({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const { mutate } = loginMutation();

  useEffect(() => {
    reset({
      username: "some",
      password: "testing",
    });
  }, []);

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  const onSubmit = () => {
    const { username, password } = getValues();

    mutate(
      { username, password },
      {
        onSuccess: (data) => {
          dispatch(loginHandler(data.access_token));
          refetch();
          navigate("/");
          successToast("Добро пожаловать");
          // window.location.reload();
        },
      }
    );
  };
  return (
    <div className={styles.login_wrap}>
      <div className={cl(styles.content, "p-5 shadow bg-white rounded")}>
        <h2 className="text-center mb-3">Авторизация</h2>
        <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
          <BaseInput className="mb-0" error={errors.username}>
            <MainInput
              register={register("username", { required: "required" })}
              autoFocus
              placeholder={"Логин"}
            />
          </BaseInput>
          <BaseInput className="mb-0" error={errors.password}>
            <MainInput
              register={register("password", { required: "required" })}
              type="password"
              placeholder={"Пароль"}
            />
          </BaseInput>

          <button type="submit" className="btn btn-primary btn-fill pull-right">
            Логин
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
