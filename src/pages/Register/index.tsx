import { useForm } from "react-hook-form";
import styles from "./index.module.scss";
import cl from "classnames";
import registerMutation from "src/hooks/mutation/registerMutation";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import { loginHandler, tokenSelector } from "src/redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useToken from "src/hooks/useToken";
import { errorToast, successToast } from "src/utils/toast";
import InputBlock from "src/components/Input";

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector(tokenSelector);
  const { refetch } = useToken({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const { mutate } = registerMutation();

  useEffect(() => {
    // if (token) navigate("/");
  }, [navigate, token]);

  const onSubmit = () => {
    const { username, password, full_name } = getValues();

    mutate(
      {
        username,
        password,
        full_name,
      },
      {
        onSuccess: (data) => {
          // dispatch(loginHandler(data.access_token));
          refetch();
          navigate("/");
          successToast("Добро пожаловать");
        },
        onError: (error: any) => errorToast(error.toString()),
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
            className="form-control"
            autoFocus
            label="Логин"
            error={errors.username}
          />

          <InputBlock
            register={register("password", { required: "required" })}
            className="form-control"
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

export default Register;
