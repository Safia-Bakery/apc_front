import { FC, useEffect, useState } from "react";
import BaseSelect from "src/components/BaseSelect";
import InputBlock from "src/components/Input";
import useDebounce from "src/hooks/useDebounce";
import useUsers from "src/hooks/useUsers";
import { rolesSelector } from "src/redux/reducers/cacheResources";
import { useAppSelector } from "src/redux/utils/types";
import { StatusName, itemsPerPage } from "src/utils/helpers";

interface Props {
  currentPage: number;
}

const UsersFilter: FC<Props> = ({ currentPage }) => {
  const roles = useAppSelector(rolesSelector);
  const [full_name, $full_name] = useDebounce("");
  const [username, $username] = useDebounce("");
  const [phone_number, $phone_number] = useDebounce("");
  const [role_id, $role_id] = useState<number>();
  const [user_status, $user_status] = useState<number>();

  const { refetch } = useUsers({
    size: itemsPerPage,
    page: currentPage,
    enabled: false,
    body: {
      user_status,
      ...(!!full_name && { full_name }),
      ...(!!role_id && { role_id }),
      ...(!!username && { username }),
      ...(!!phone_number && { phone_number }),
    },
  });

  useEffect(() => {
    refetch();
  }, [full_name, username, phone_number, role_id, user_status]);
  return (
    <>
      <td></td>
      <td className="p-0">
        <InputBlock
          onChange={(e) => $full_name(e.target.value)}
          blockClass={"m-2"}
          className="form-control"
        />
      </td>
      <td className="p-0">
        <InputBlock
          onChange={(e) => $username(e.target.value)}
          blockClass={"m-2"}
          className="form-control"
        />
      </td>
      <td className="p-0">
        <BaseSelect
          blockClass={"m-2"}
          defaultSelected
          onChange={(e) => $role_id(Number(e.target.value))}
          values={roles}
        />
      </td>
      <td className="p-0">
        <InputBlock
          onChange={(e) => $phone_number(e.target.value)}
          blockClass={"m-2"}
          className="form-control"
        />
      </td>
      <td className="p-0">
        <BaseSelect
          defaultSelected
          blockClass={"m-2"}
          onChange={(e) => $user_status(Number(e.target.value))}
          values={StatusName}
        />
      </td>
      <td></td>
    </>
  );
};

export default UsersFilter;
