import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import permissionMutation from "src/hooks/mutation/permissionMutation";
import useRolePermission from "src/hooks/useRolePermission";
import { Fragment, useEffect } from "react";
import Loading from "src/components/Loader";
import usePermissions from "src/hooks/usePermissions";
import { useForm } from "react-hook-form";
import { errorToast, successToast } from "src/utils/toast";

const ShowRole = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    reset,
  } = useForm();

  const onSubmit = () => {
    const ids = Object.values(getValues())
      .filter((val) => !!val)
      .map((item) => +item);

    console.log(ids, "ids");

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

  if (isLoading) return <Loading />;

  return (
    <Card>
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
                    <th className={styles.tableHead}>{item?.page_name}</th>
                    <th className={styles.tableHead} />
                  </tr>
                </thead>

                <tbody>
                  {item.actions.map((child) => (
                    <tr key={child?.id}>
                      <td>{child?.action_name}</td>
                      <td width={50}>
                        <input
                          type="checkbox"
                          value={child?.id}
                          {...register(`${child?.id}`)}
                          // defaultChecked={rolePermission?.permissions?.includes(
                          //   child?.id
                          // )}
                          // onChange={() => handlePermission(child?.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Fragment>
            );
          })}
        </table>

        <button className="btn btn-success" type="submit" id="save_permission">
          save
        </button>
      </form>
    </Card>
  );
};

export default ShowRole;
