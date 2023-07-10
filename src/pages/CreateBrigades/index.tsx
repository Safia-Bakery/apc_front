import { useNavigate, useParams } from "react-router-dom";
import Card from "src/components/Card";
import Header from "src/components/Header";
import styles from "./index.module.scss";
import InputBlock from "src/components/Input";
import { useForm } from "react-hook-form";
import cl from "classnames";
import { ChangeEvent, useState } from "react";

const paymentType = ["Перечисление", "Наличные", "Перевод на карту"];

const CreateBrigades = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const [payment_type, $payment_type] = useState<string>(paymentType[0]);

  const handlePayment = (e: ChangeEvent<HTMLSelectElement>) =>
    $payment_type(e.target.value);

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
            <div className="form-group">
              <label className={styles.label}>РОЛЬ</label>
              <select
                defaultValue={"Select Item"}
                className="form-select"
                onChange={handlePayment}
              >
                {paymentType.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
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

export default CreateBrigades;
