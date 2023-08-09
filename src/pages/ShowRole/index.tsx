import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import permissionMutation from "src/hooks/mutation/permissionMutation";
import useRolePermission from "src/hooks/useRolePermission";
import { permissioms as role } from "src/utils/helpers";
import { useEffect, useState } from "react";
import Loading from "src/components/Loader";
import { successToast } from "src/utils/toast";
import usePermissions from "src/hooks/usePermissions";
import useToken from "src/hooks/useToken";

const ShowRole = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const goBack = () => navigate(-1);
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
  const { data: user } = useToken({ enabled: false });
  //@ts-ignore
  const me = role?.permissions === "*" ? me : user;

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
          goBack();
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
      <Header title={`${rolePermission?.role_name}`} subTitle={`${me?.role}`}>
        <button className="btn btn-primary btn-fill" onClick={goBack}>
          Назад
        </button>
      </Header>

      <div className="content">
        <table className="table table-striped table-hover report-table">
          <thead>
            <tr>
              <th className={styles.tableHead}>#</th>
              <th className={styles.tableHead}>Наименование</th>
              <th className={styles.tableHead}></th>
            </tr>
          </thead>
          <tbody>
            {permissions?.map(({ id, page_name }, idx) => {
              return (
                <tr key={id}>
                  <td width={30}>{idx + 1}</td>
                  <td>{page_name}</td>
                  <td width={50}>
                    <input
                      type="checkbox"
                      value={id}
                      defaultChecked={rolePermission?.permissions.includes(id)}
                      onChange={() => handlePermission(id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button className="btn btn-success" onClick={handleSave}>
          save
        </button>
      </div>
    </Card>
  );
};

export default ShowRole;
