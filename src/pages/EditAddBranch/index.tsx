import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import InputBlock from "src/components/Input";
import { useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useState } from "react";
import cl from "classnames";
import useBranch from "src/hooks/useBranch";
import branchMutation from "src/hooks/mutation/branchMutation";
import useBranches from "src/hooks/useBranches";
import { errorToast, successToast } from "src/utils/toast";

const EditAddBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const [status, $status] = useState(0);

  const { mutate } = branchMutation();

  const { data: branch, refetch } = useBranch({ id: Number(id) });
  const { refetch: branchesRefetch } = useBranches({ enabled: false });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const handleStatus = (e: ChangeEvent<HTMLInputElement>) =>
    $status(Number(e.target.value));

  const onSubmit = () => {
    const { lat, lng, region, name } = getValues();
    mutate(
      {
        latitude: Number(lat),
        longtitude: Number(lng),
        country: region,
        name,
        status,
        ...(id && { id: Number(id) }),
      },
      {
        onSuccess: () => {
          branchesRefetch();
          refetch();
          successToast(!!id ? "successfully updated" : "successfully created");
          navigate("/branches");
        },
        onError: (e: any) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    if (branch && id) {
      $status(branch?.status);
      reset({
        name: branch?.name,
        lat: branch.latitude,
        lng: branch.longtitude,
        region: branch.country,
      });
    }
  }, [branch]);
  return (
    <Card>
      <Header title={"EditAddSetting"}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        <InputBlock
          register={register("name", { required: "Обязательное поле" })}
          className="form-control mb-2"
          label="НАЗВАНИЕ"
          disabled={!!id}
          error={errors.name}
        />
        <InputBlock
          register={register("region", { required: "Обязательное поле" })}
          className="form-control mb-2"
          label="РЕГИОН"
          disabled={!!id}
          error={errors.region}
        />

        <InputBlock
          register={register("lat", { required: "Обязательное поле" })}
          className="form-control mb-2"
          label="ШИРОТА"
          error={errors.lat}
        />

        <InputBlock
          register={register("lng", { required: "Обязательное поле" })}
          className="form-control mb-2"
          label="ДОЛГОТА"
          error={errors.lng}
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

export default EditAddBranch;
