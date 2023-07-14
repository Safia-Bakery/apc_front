import { useNavigate, useParams } from "react-router-dom";
import Card from "src/components/Card";
import Header from "src/components/Header";
import styles from "./index.module.scss";
import InputBlock from "src/components/Input";
import { useForm } from "react-hook-form";
import cl from "classnames";
import { ChangeEvent, useEffect, useState } from "react";
import { errorToast, successToast } from "src/utils/toast";
import useBrigadas from "src/hooks/useBrigadas";
import { useAppSelector } from "src/redux/utils/types";
import { rolesSelector } from "src/redux/reducers/cacheResources";
import useBrigada from "src/hooks/useBrigada";
import brigadaMutation from "src/hooks/mutation/brigadaMutation";

const CreateBrigades = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { refetch: brigadasRefetch } = useBrigadas({ enabled: false });
  const [status, $status] = useState(0);
  const handleStatus = (e: ChangeEvent<HTMLInputElement>) =>
    $status(Number(e.target.value));
  const { mutate } = brigadaMutation();

  const { data: brigada } = useBrigada({ id: Number(id) });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  useEffect(() => {
    if (id)
      reset({
        brigada_name: brigada?.name,
        brigada_description: brigada?.description,
        status: brigada?.status,
      });
  }, [brigada, id]);

  const onSubmit = () => {
    const { brigada_name, brigada_description } = getValues();

    mutate(
      {
        status,
        users: [1, 2],
        description: brigada_description,
        name: brigada_name,
        ...(id && { id: Number(id) }),
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
      <Header title={!id ? "Добавить" : `Изменить бригада №${id}`}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div>
            <InputBlock
              register={register("brigada_name", {
                required: "Обязательное поле",
              })}
              className="form-control mb-2"
              label="Название бригады"
              error={errors.brigada_name}
            />
            {/* <InputBlock
              register={register("username", { required: "Обязательное поле" })}
              className="form-control mb-2"
              label="ЛОГИН"
              error={errors.username}
            /> */}
          </div>
          {/* <div className="col-md-6"> */}
          {/* <div className="form-group">
              <label className={styles.label}>РОЛЬ</label>
              <select
                defaultValue={"Select Item"}
                className={cl("form-select", styles.select)}
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
            /> */}
          {/* </div> */}
        </div>

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
          <div className={cl(styles.formControl, "form-control")}>
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
