import Card from "src/components/Card";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import InputBlock from "src/components/Input";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import roleMutation from "src/hooks/mutation/roleMutation";
import { successToast } from "src/utils/toast";
import useRoles from "src/hooks/useRoles";
import useRolePermission from "src/hooks/useRolePermission";

const EditAddRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { refetch: usersRefetch } = useRoles({ enabled: false });
  const { mutate: postRole } = roleMutation();

  const { data: role, refetch: roleRefecth } = useRolePermission({
    id: Number(id),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();

  const onSubmit = () => {
    postRole(
      { name: getValues("name"), id: Number(id) },
      {
        onSuccess: () => {
          successToast(!id ? "role created" : "role updated");
          navigate("/roles");
          usersRefetch();
          roleRefecth();
        },
      }
    );
  };

  useEffect(() => {
    if (id && role?.role_name) {
      reset({
        name: role.role_name,
        key: "",
      });
    }
  }, [role?.role_name, id]);
  return (
    <Card>
      <Header title={!id ? "Добавить" : `Изменить роль №${id}`}>
        <button className="btn btn-success btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <form className="p-3" onSubmit={handleSubmit(onSubmit)}>
        <InputBlock
          register={register("name", { required: "Обязательное поле" })}
          className="mb-2"
          label="НАИМЕНОВАНИЕ"
          error={errors.name}
        />

        {/* <div className="form-group field-category-is_active">
          <label className={styles.label}>СТАТУС</label>
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
        </div> */}

        <button type="submit" className="btn btn-success btn-fill">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default EditAddRole;
