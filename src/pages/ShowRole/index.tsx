import Card from "@/components/Card";
import Header from "@/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import permissionMutation from "@/hooks/mutation/permissionMutation";
import useRolePermission from "@/hooks/useRolePermission";
import { Fragment, useEffect } from "react";
import Loading from "@/components/Loader";
import usePermissions from "@/hooks/usePermissions";
import { useForm } from "react-hook-form";
import { errorToast, successToast } from "@/utils/toast";
import useQueryString from "@/hooks/custom/useQueryString";

const ShowRole = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const view_ids = useQueryString("view_ids");
  const {
    data: rolePermission,
    refetch,
    isLoading,
  } = useRolePermission({
    id: Number(id),
    enabled: !!id,
  });

  const { mutate } = permissionMutation();
  const { data: permissions } = usePermissions({});

  const { register, handleSubmit, getValues, reset } = useForm();

  const onSubmit = () => {
    const ids = Object.values(getValues())
      .filter((val) => !!val)
      .map((item) => +item);

    mutate(
      { ids, id: Number(id) },
      {
        onSuccess: () => {
          refetch();
          successToast("successfully updated");
        },
        onError: (e: any) => errorToast(e.message),
      }
    );
  };

  useEffect(() => {
    if (rolePermission?.permissions) {
      const init = rolePermission?.permissions.reduce((acc: any, item) => {
        acc[item] = item;
        return acc;
      }, {});
      reset(init);
    }
  }, [rolePermission?.permissions]);

  if (isLoading) return <Loading absolute />;

  return (
    <Card className={"pb-11"}>
      <Header title={`${rolePermission?.role_name}`}>
        <button
          className="btn btn-primary btn-fill"
          onClick={() => navigate(-1)}
        >
          Назад
        </button>
      </Header>

      <form className="content" onSubmit={handleSubmit(onSubmit)}>
        <table className="table table-striped table-hover report-table">
          {permissions?.map((item) => {
            return (
              <Fragment key={item?.page_name}>
                <thead>
                  <tr>
                    <th className={"bg-primary text-white"}>
                      {item?.page_name}
                    </th>
                    <th className={"bg-primary text-white"} />
                  </tr>
                </thead>

                <tbody>
                  {item.actions.map((child) => (
                    <tr key={child?.id}>
                      <td>
                        {!view_ids
                          ? child?.action_name
                          : `${child?.action_name} = ${child?.id}`}
                      </td>
                      <td width={50}>
                        <input
                          type="checkbox"
                          value={child?.id}
                          {...register(`${child?.id}`)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Fragment>
            );
          })}
        </table>

        <button
          className="btn btn-success float-end"
          type="submit"
          id="save_permission"
        >
          Сохранить
        </button>
      </form>
    </Card>
  );
};

export default ShowRole;
