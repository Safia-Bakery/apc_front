import { useNavigate, useParams } from "react-router-dom";
import Card from "src/components/Card";
import Header from "src/components/Header";
import styles from "./index.module.scss";
import InputBlock from "src/components/Input";
import { useForm } from "react-hook-form";
import cl from "classnames";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppSelector } from "src/redux/utils/types";
import { rolesSelector } from "src/redux/reducers/cacheResources";
import userMutation from "src/hooks/mutation/userMutation";
import { errorToast, successToast } from "src/utils/toast";
import useUsers from "src/hooks/useUsers";
import useUser from "src/hooks/useUser";

const EditAddUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const roles = useAppSelector(rolesSelector);
  const [status, $status] = useState(0);
  const { refetch: userRefetch } = useUsers({ enabled: false });
  const { data: user } = useUser({ id: Number(id) });

  const { mutate } = userMutation();

  const onSubmit = () => {
    const { username, password, phone_number, full_name, email, group_id } =
      getValues();

    mutate(
      {
        full_name,
        username,
        group_id,
        email,
        password,
        status,
        phone_number,
        ...(id && { id: Number(id) }),
      },
      {
        onSuccess: () => {
          userRefetch();
          successToast(!!id ? "successfully updated" : "successfully created");
          navigate("/users");
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

  const handleStatus = (e: ChangeEvent<HTMLInputElement>) =>
    $status(Number(e.target.value));

  useEffect(() => {
    if (id && user) {
      reset({
        full_name: user.full_name,
        username: user.username,
        group_id: user.group?.id,
        email: user.email,
        phone_number: user.phone_number,
        status: user.status,
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
            <InputBlock
              register={register("phone_number")}
              className="form-control mb-2"
              label="ТЕЛЕФОН"
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
              register={register("password", { required: "Обязательное поле" })}
              className="form-control mb-2"
              inputType="password"
              error={errors.password}
              label="ПАРОЛЬ"
            />
            <InputBlock
              register={register("email")}
              className="form-control mb-2"
              inputType="email"
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

        <div className="form-group field-category-is_active">
          <label className={styles.label}>СТАТУС</label>
          <div
            id="category-is_active"
            className={cl(styles.formControl, "form-control")}
          >
            <label className={styles.radioBtn}>
              <input type="radio" value="1" onChange={handleStatus} />
              Активный
            </label>
            <label className={styles.radioBtn}>
              <input
                type="radio"
                value="0"
                onChange={handleStatus}
                checked={!status}
              />
              Не активный
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-success btn-fill">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default EditAddUser;
