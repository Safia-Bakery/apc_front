import { useNavigate, useParams } from "react-router-dom";
import Card from "src/components/Card";
import Header from "src/components/Header";
import styles from "./index.module.scss";
import InputBlock from "src/components/Input";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useAppSelector } from "src/redux/utils/types";
import { rolesSelector } from "src/redux/reducers/cacheResources";
import userMutation from "src/hooks/mutation/userMutation";
import { successToast } from "src/utils/toast";
import useUsers from "src/hooks/useUsers";
import useUser from "src/hooks/useUser";
import InputMask from "react-input-mask";
import { fixedString } from "src/utils/helpers";

const EditAddUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const roles = useAppSelector(rolesSelector);
  const { refetch: userRefetch } = useUsers({ enabled: false });
  const { data: user } = useUser({ id: Number(id) });

  const mutation = userMutation();

  const onSubmit = () => {
    const { username, password, phone_number, full_name, email, group_id } =
      getValues();

    mutation.mutate(
      {
        full_name,
        username,
        group_id,
        status: 2,
        email,
        password,
        phone_number: fixedString(phone_number),
        ...(id && { id: Number(id) }),
      },
      {
        onSuccess: (data: any) => {
          if (data.status === 200) {
            userRefetch();
            navigate("/users");
            successToast(
              !!id ? "successfully updated" : "successfully created"
            );
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
      reset({
        full_name: user.full_name,
        username: user.username,
        group_id: user.group?.id,
        email: user.email,
        phone_number: user.phone_number,
      });
    }
  }, [user, id]);

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
            <InputBlock
              register={register("full_name", {
                required: "Обязательное поле",
              })}
              className="form-control mb-2"
              label="ФИО"
              error={errors.full_name}
            />
            <InputBlock
              register={register("username", { required: "Обязательное поле" })}
              className="form-control mb-2"
              label="ЛОГИН"
              error={errors.username}
            />
            <label className={styles.label}>ТЕЛЕФОН</label>
            <InputMask
              className="form-control"
              mask="(999-99)-999-99-99"
              defaultValue={"998"}
              {...register("phone_number", {
                required: "required",
              })}
            />
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className={styles.label}>РОЛЬ</label>
              <select
                defaultValue={"Select Item"}
                {...register("group_id", { required: "Обязательное поле" })}
                className="form-select"
              >
                {roles?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.department && (
                <div className="alert alert-danger p-2" role="alert">
                  {errors.department.message?.toString()}
                </div>
              )}
            </div>
            <InputBlock
              register={register("password", {
                required: "Обязательное поле",
                minLength: {
                  value: 6,
                  message: "Надо ввести минимум 6 символов",
                },
              })}
              className="form-control mb-2"
              inputType="password"
              error={errors.password}
              label="ПАРОЛЬ"
            />
            <InputBlock
              register={register("email")}
              className="form-control mb-2"
              // inputType="email"
              label="E-MAIL"
            />
          </div>
        </div>
        <div>
          <label className={styles.label}>ОПИСАНИЕ</label>
          <textarea
            rows={4}
            {...register("description")}
            className={`form-control h-100 ${styles.textArea}`}
            name="description"
          />
        </div>

        <button type="submit" className="btn btn-success btn-fill mt-3">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default EditAddUser;
