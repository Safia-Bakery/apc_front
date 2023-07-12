import { useNavigate, useParams } from "react-router-dom";
import Card from "src/components/Card";
import Header from "src/components/Header";
import styles from "./index.module.scss";
import InputBlock from "src/components/Input";
import { useForm } from "react-hook-form";
import cl from "classnames";
import { ChangeEvent, useState } from "react";
import userMutation from "src/hooks/mutation/userMutation";
import useRoles from "src/hooks/useRoles";
import { errorToast, successToast } from "src/utils/toast";
import useBrigadas from "src/hooks/useBrigadas";

const CreateBrigades = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { refetch: brigadasRefetch } = useBrigadas({ enabled: false });
  const [status, $status] = useState(0);
  const handleStatus = (e: ChangeEvent<HTMLInputElement>) =>
    $status(Number(e.target.value));
  const { mutate } = userMutation();

  const { data: roles } = useRoles({});

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = () => {
    const {
      username,
      password,
      full_name,
      brigada_name,
      brigada_description,
      group_id,
    } = getValues();

    mutate(
      {
        group_id,
        status,
        full_name,
        username,
        password,
        brigada_description,
        brigada_name,
      },
      {
        onSuccess: () => {
          brigadasRefetch();
          successToast(!!id ? "successfully updated" : "successfully created");
          navigate("/brigades");
        },
        onError: (e: any) => errorToast(e.message),
      }
    );
  };
  return (
    <Card>
      <Header title={"Изменить | Добавить"}>
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
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label className={styles.label}>РОЛЬ</label>
              <select
                defaultValue={"Select Item"}
                className="form-select"
                {...register("group_id", { required: "Обязательное поле" })}
              >
                {roles?.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
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
              label="ПАРОЛЬ"
              error={errors.password}
            />
          </div>
        </div>
        <InputBlock
          register={register("brigada_name", { required: "Обязательное поле" })}
          className="form-control mb-2"
          label="brigada_name"
          error={errors.brigada_name}
        />
        <div>
          <label className={styles.label}>ОПИСАНИЕ</label>
          <textarea
            rows={4}
            {...register("brigada_description")}
            className={`form-control h-100 ${styles.textArea}`}
            name="brigada_description"
          />
        </div>

        <div className="form-group field-category-is_active">
          <label className={styles.label}>СТАТУС</label>
          <div
            id="category-is_active"
            className={cl(styles.formControl, "form-control")}
          >
            <label className={styles.radioBtn}>
              <input onChange={handleStatus} type="radio" value="1" />
              Активный
            </label>
            <label className={styles.radioBtn}>
              <input
                onChange={handleStatus}
                type="radio"
                value="0"
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

export default CreateBrigades;
