import { useForm } from "react-hook-form";
import styles from "./index.module.scss";
import cl from "classnames";
import loginMutation from "src/hooks/mutation/loginMutation";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import { loginHandler, tokenSelector } from "src/redux/reducers/authReducer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useToken from "src/hooks/useToken";
import { errorToast, successToast } from "src/utils/toast";
import InputMask from "react-input-mask";
import { fixedString } from "src/utils/helpers";

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
  } = useForm();

  const { mutate } = loginMutation();

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  const onSubmit = () => {
    const { username, password } = getValues();

    mutate(
      { username: "998" + fixedString(username), password },
      {
        onSuccess: (data) => {
          dispatch(loginHandler(data.access_token));
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
          <div>
            <label>Логин</label>
            <InputMask
              className="form-control"
              mask="(99) 999-99-99"
              value={909520009}
              autoFocus
              {...register("username", { required: "required" })}
              alwaysShowMask
            />
          </div>
          <div className="">
            <label>Пароль</label>

            <input
              {...register("password", { required: "required" })}
              className="form-control"
              value={"123456"}
              placeholder="Пароль"
              type="password"
            />

            {errors.password && (
              <div className="alert alert-danger p-2" role="alert">
                {errors.password?.message?.toString()}
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-info btn-fill pull-right">
            Логин
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
