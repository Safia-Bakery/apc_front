import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import InputBlock from "src/components/Input";
import cl from "classnames";
import { useForm } from "react-hook-form";

const ShowCategory = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const { id } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();
  return (
    <Card>
      <Header title={"ShowCategory"}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>
      <form className="p-3">
        <InputBlock
          register={register("name", { required: "Обязательное поле" })}
          className="form-control"
          label="НАИМЕНОВАНИЕ"
        />

        <label className={styles.label}>ОПИСАНИЕ</label>

        <textarea
          {...register("description", { required: "Обязательное поле" })}
          rows={4}
          className="form-control h-100"
        />

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

export default ShowCategory;
