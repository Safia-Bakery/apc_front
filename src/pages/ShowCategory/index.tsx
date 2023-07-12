import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import InputBlock from "src/components/Input";
import cl from "classnames";
import { useForm } from "react-hook-form";
import useCategory from "src/hooks/useCategory";
import { ChangeEvent, useEffect, useState } from "react";
import categoryMutation from "src/hooks/mutation/categoryMutation";
import useCategories from "src/hooks/useCategories";
import { successToast } from "src/utils/toast";

const ShowCategory = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { refetch: categoryRefetch } = useCategories({ enabled: false });

  const { id } = useParams();

  const { data: category } = useCategory({ id: Number(id) });
  const [status, $status] = useState(0);
  const { mutate } = categoryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = () => {
    const { name, description } = getValues();
    mutate(
      { name, description, status, ...(id && { id: Number(id) }) },
      {
        onSuccess: () => {
          categoryRefetch();
          successToast(!!id ? "successfully updated" : "successfully created");
          navigate("/categories");
        },
      }
    );
  };

  const handleStatus = (e: ChangeEvent<HTMLInputElement>) =>
    $status(Number(e.target.value));

  useEffect(() => {
    if (category) {
      $status(category?.status);
      reset({
        name: category?.name,
        description: category?.description,
      });
    }
  }, [category]);

  return (
    <Card>
      <Header title={"ShowCategory"}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>
      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
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
              <input
                checked={!!status}
                type="radio"
                value={1}
                onChange={handleStatus}
              />
              Активный
            </label>
            <label className={styles.radioBtn}>
              <input
                type="radio"
                value={0}
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

export default ShowCategory;
