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
import useBrigada from "src/hooks/useBrigada";
import brigadaMutation from "src/hooks/mutation/brigadaMutation";
import Select, { MultiValue } from "react-select";
import { useAppSelector } from "src/redux/utils/types";
import { usersSelector } from "src/redux/reducers/cacheResources";
import { ValueLabel } from "src/utils/types";
import useUsersForBrigada from "src/hooks/useUsersForBrigada";

const CreateBrigades = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { refetch: brigadasRefetch } = useBrigadas({ enabled: false });
  const [status, $status] = useState(0);
  const handleStatus = (e: ChangeEvent<HTMLInputElement>) =>
    $status(Number(e.target.value));
  const { mutate } = brigadaMutation();
  useUsersForBrigada({ id: Number(id) });
  const users = useAppSelector(usersSelector);
  const { data: brigada, refetch: brigadaRefetch } = useBrigada({
    id: Number(id),
  });
  const [selectedUsers, $selectedUsers] = useState<MultiValue<ValueLabel>>();
  const [selectedIds, $selectedIds] = useState<number[]>([]);

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
        brigada_name: brigada?.name,
        brigada_description: brigada?.description,
        status: brigada?.status,
      });
      if (brigada?.user?.length) {
        $selectedUsers(
          brigada.user.map((item) => ({
            value: item.id,
            label: item.username,
          }))
        );
      }
    }
  }, [brigada, id, users]);

  const handleUsers = (_: MultiValue<any>, ids: any) =>
    $selectedIds((id) => [...id, ids.option.value]);

  const onSubmit = () => {
    const { brigada_name, brigada_description } = getValues();

    mutate(
      {
        status,
        users: selectedIds,
        description: brigada_description,
        name: brigada_name,
        ...(id && { id: Number(id) }),
      },
      {
        onSuccess: () => {
          brigadasRefetch();
          brigadaRefetch();
          successToast(!!id ? "successfully updated" : "successfully created");
          navigate("/brigades");
        },
        onError: (e: Error) => errorToast(e.message),
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
          </div>
        </div>

        {!!id && (
          <div className="mb-3">
            <label className={styles.label}>Добавить пользователей</label>
            <Select
              isMulti
              onChange={handleUsers}
              defaultValue={selectedUsers}
              options={users}
              value={selectedUsers}
            />
          </div>
        )}
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
              <input onChange={handleStatus} type="radio" value="0" />
              Активный
            </label>
            <label className={styles.radioBtn}>
              <input
                onChange={handleStatus}
                type="radio"
                value="2"
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
