import { FC } from "react";
import BaseInput from "src/components/BaseInputs";
import BaseInputs from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainSelect from "src/components/BaseInputs/MainSelect";
import { useNavigateParams } from "src/hooks/useCustomNavigate";
import useDebounce from "src/hooks/useDebounce";
import useQueryString from "src/hooks/useQueryString";
import useRoles from "src/hooks/useRoles";
import useUpdateEffect from "src/hooks/useUpdateEffect";

interface Props {
  currentPage: number;
}

const StatusName = [
  { name: "Активный", id: 0 },
  { name: "Не активный", id: 2 },
];

const UsersFilter: FC<Props> = () => {
  const navigate = useNavigateParams();
  const [full_name, $full_name] = useDebounce("");
  const [username, $username] = useDebounce("");
  const [phone_number, $phone_number] = useDebounce("");
  const { data: roles, refetch: rolesRefetch } = useRoles({ enabled: false });
  const user_status = useQueryString("user_status");
  const role_id = useQueryString("role_id");

  useUpdateEffect(() => {
    navigate({ full_name });
  }, [full_name]);

  useUpdateEffect(() => {
    navigate({ username });
  }, [username]);

  useUpdateEffect(() => {
    navigate({ phone_number });
  }, [phone_number]);

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
            value={role_id?.toString()}
            onChange={(e) => navigate({ role_id: e.target.value })}
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
            value={user_status?.toString()}
            onChange={(e) => navigate({ user_status: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td></td>
    </>
  );
};

export default UsersFilter;
