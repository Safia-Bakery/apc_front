import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import roleMutation from "@/hooks/mutation/roleMutation";
import { errorToast, successToast } from "@/utils/toast";
import useRoles from "@/hooks/useRoles";
import useRolePermission from "@/hooks/useRolePermission";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";

const EditAddRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const goBack = () => navigate("/users");
  const { refetch: usersRefetch } = useRoles({ enabled: !!id });
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
          if (!!id) roleRefecth();
        },
        onError: (e: any) => errorToast(e.message),
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
        <BaseInputs label="НАИМЕНОВАНИЕ" error={errors.name}>
          <MainInput
            autoFocus
            register={register("name", { required: "Обязательное поле" })}
          />
        </BaseInputs>

        <button type="submit" className="btn btn-success btn-fill">
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default EditAddRole;
