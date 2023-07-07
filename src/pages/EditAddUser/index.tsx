import { useNavigate, useParams } from "react-router-dom";
import Card from "src/components/Card";
import Header from "src/components/Header";
import styles from "./index.module.scss";
import InputBlock from "src/components/Input";
import { useForm } from "react-hook-form";
import cl from "classnames";

const EditAddUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  return (
    <Card>
      <Header title={"Изменить | Добавить"}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <form className="content">
        <div className="row">
          <div className="col-md-6">
            <InputBlock
              register={register("name", { required: "Обязательное поле" })}
              className="form-control mb-2"
              label="ФИО"
            />
            <InputBlock
              register={register("name", { required: "Обязательное поле" })}
              className="form-control mb-2"
              label="ЛОГИН"
            />
            <InputBlock
              register={register("name", { required: "Обязательное поле" })}
              className="form-control mb-2"
              label="ТЕЛЕФОН"
            />
          </div>
          <div className="col-md-6">
            <InputBlock
              register={register("name", { required: "Обязательное поле" })}
              className="form-control mb-2"
              label="РОЛЬ"
            />
            <InputBlock
              register={register("name", { required: "Обязательное поле" })}
              className="form-control mb-2"
              inputType="password"
              label="ПАРОЛЬ"
            />
            <InputBlock
              register={register("name", { required: "Обязательное поле" })}
              className="form-control mb-2"
              inputType="email"
              label="E-MAIL"
            />
          </div>
        </div>
        <div className="">
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
          <input type="hidden" name="Category[is_active]" value="" />
          <div
            id="category-is_active"
            className={cl(styles.formControl, "form-control")}
          >
            <label className={styles.radioBtn}>
              <input type="radio" name="Category[is_active]" value="1" />
              Активный
            </label>
            <label className={styles.radioBtn}>
              <input type="radio" value="0" checked={true} />
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
