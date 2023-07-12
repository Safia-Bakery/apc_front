import Card from "src/components/Card";
import styles from "./index.module.scss";
import Header from "src/components/Header";
import { useNavigate, useParams } from "react-router-dom";
import usePermissions from "src/hooks/usePermissions";
import permissionMutation from "src/hooks/mutation/permissionMutation";
import { useAppSelector } from "src/redux/utils/types";
import {
  permissionSelector,
  treeSelector,
} from "src/redux/reducers/cacheResources";
import useRolePermission from "src/hooks/useRolePermission";
import { roleSelector } from "src/redux/reducers/authReducer";
import { useEffect, useState } from "react";
import Loading from "src/components/Loader";

interface TreeTypes {
  [key: number]: string;
}

const column = [
  { name: "#" },
  { name: "Наименование" },
  { name: "Количество" },
  { name: "Примичание" },
  { name: "Дата" },
  {
    name: "Автор",
  },
];

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

  const permissions = useAppSelector(permissionSelector);
  const me = useAppSelector(roleSelector);

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
    mutate({ ids, id: Number(id) });
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
                      // defaultChecked={page_name === idTree?.[`${id}`]}
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
