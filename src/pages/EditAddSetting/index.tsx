import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import InputBlock from "src/components/Input";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

const EditAddSetting = () => {
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
  useEffect(() => {
    if (id) {
      reset({
        name: "test name",
        key: "skjwns sijw sj wjs jwh ",
        mean: "mean",
      });
    }
  }, []);
  return (
    <Card>
      <Header title={"EditAddSetting"}>
        <button className="btn btn-success btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <form className="p-3">
        <InputBlock
          register={register("name", { required: "Обязательное поле" })}
          className="form-control mb-2"
          label="НАЗВАНИЕ"
        />

        <InputBlock
          register={register("key", { required: "Обязательное поле" })}
          className="form-control mb-2"
          disabled={!!id}
          label="КЛЮЧ"
        />

        <InputBlock
          register={register("mean", { required: "Обязательное поле" })}
          className="form-control mb-2"
          label="ЗНАЧЕНИЯ"
        />

        <button type="submit" className="btn btn-success btn-fill">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default EditAddSetting;
