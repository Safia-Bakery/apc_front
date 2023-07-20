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
import InputBlock from "src/components/Input";

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
      <div className={cl(styles.content, "p-4 shadow bg-white rounded")}>
        <h1 className="text-center mb-3">Войти</h1>
        <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)}>
          <InputBlock
            register={register("username", { required: "required" })}
            autoFocus
            label="Логин"
            error={errors.username}
          />
          <InputBlock
            register={register("password", { required: "required" })}
            inputType="password"
            label="Пароль"
            error={errors.password}
          />

          <button type="submit" className="btn btn-info btn-fill pull-right">
            Логин
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
