import { FC, useEffect, useRef, useState } from "react";
import BaseInput from "src/components/BaseInputs";
import BaseInputs from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainSelect from "src/components/BaseInputs/MainSelect";
import useDebounce from "src/hooks/useDebounce";
import useRoles from "src/hooks/useRoles";
import useUsers from "src/hooks/useUsers";
import { itemsPerPage } from "src/utils/helpers";

interface Props {
  currentPage: number;
}

const StatusName = [
  { name: "Активный", id: 0 },
  { name: "Не активный", id: 2 },
];

const UsersFilter: FC<Props> = ({ currentPage }) => {
  const initialLoadRef = useRef(true);
  const [full_name, $full_name] = useDebounce("");
  const [username, $username] = useDebounce("");
  const [phone_number, $phone_number] = useDebounce("");
  const [role_id, $role_id] = useState<number>();
  const [user_status, $user_status] = useState<number>();
  const { data: roles, refetch: rolesRefetch } = useRoles({ enabled: false });

  const { refetch } = useUsers({
    size: itemsPerPage,
    page: currentPage,

    body: {
      user_status,
      ...(!!full_name && { full_name }),
      ...(!!role_id && { role_id }),
      ...(!!username && { username }),
      ...(!!phone_number && { phone_number }),
    },
  });

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    const fetchData = async () => {
      await refetch();
    };

    fetchData();
  }, [full_name, username, phone_number, role_id, user_status]);
  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInput className="m-2">
          <MainInput onChange={(e) => $full_name(e.target.value)} />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="m-2">
          <MainInput onChange={(e) => $username(e.target.value)} />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInputs className="mb-0">
          <MainSelect
            values={roles}
            onFocus={() => rolesRefetch()}
            onChange={(e) => $role_id(Number(e.target.value))}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInput className="m-2">
          <MainInput onChange={(e) => $phone_number(e.target.value)} />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInputs className="mb-0">
          <MainSelect
            values={StatusName}
            onChange={(e) => $user_status(Number(e.target.value))}
          />
        </BaseInputs>
      </td>
      <td></td>
    </>
  );
};

export default UsersFilter;
