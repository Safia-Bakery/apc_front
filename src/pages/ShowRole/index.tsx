import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import permissionMutation from "src/hooks/mutation/permissionMutation";
import useRolePermission from "src/hooks/useRolePermission";
import { Fragment, useEffect, useState } from "react";
import Loading from "src/components/Loader";
import { successToast } from "src/utils/toast";
import usePermissions from "src/hooks/usePermissions";

const ShowRole = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ids, $ids] = useState<number[]>([]);
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

  const handlePermission = (val: number) => {
    let numbers = ids || [];
    const index = numbers.indexOf(val);
    if (index === -1) {
      $ids([...ids, val]);
    } else {
      const updatedArray = ids.filter((n) => n !== val);
      $ids(updatedArray);
    }
  };
  const handleSave = () => {
    mutate(
      { ids, id: Number(id) },
      {
        onSuccess: () => {
          successToast("successfully updated");
          refetch();
        },
      }
    );
  };

  useEffect(() => {
    $ids(rolePermission?.permissions || []);
  }, [rolePermission]);

  useEffect(() => {
    if (id) refetch();
  }, [id]);

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

      <div className="content">
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
                          defaultChecked={rolePermission?.permissions?.includes(
                            child?.id
                          )}
                          onChange={() => handlePermission(child?.id)}
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
          className="btn btn-success"
          onClick={handleSave}
          id="save_permission"
        >
          save
        </button>
      </div>
    </Card>
  );
};

export default ShowRole;
