import { FC, useMemo } from "react";
import BaseInput from "@/components/BaseInputs";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainSelect from "@/components/BaseInputs/MainSelect";
import { useNavigateParams } from "custom/useCustomNavigate";
import useDebounce from "custom/useDebounce";
import useQueryString from "custom/useQueryString";
import useRoles from "@/hooks/useRoles";
import useUpdateEffect from "custom/useUpdateEffect";
import { useTranslation } from "react-i18next";

const UsersFilter = () => {
  const { t } = useTranslation();
  const navigate = useNavigateParams();
  const [full_name, $full_name] = useDebounce("");
  const [username, $username] = useDebounce("");
  const [phone_number, $phone_number] = useDebounce("");
  const { data: roles, refetch: rolesRefetch } = useRoles({ enabled: false });
  const user_status = useQueryString("user_status");
  const role_id = useQueryString("role_id");

  const StatusName = useMemo(() => {
    return [
      { name: t("active"), id: 0 },
      { name: t("not_active"), id: 2 },
    ];
  }, []);

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
      <td className="!p-0">
        <BaseInput className="!m-1">
          <MainInput
            className="!m-0"
            onChange={(e) => $full_name(e.target.value)}
          />
        </BaseInput>
      </td>
      <td className="!p-0">
        <BaseInput className="!m-1">
          <MainInput
            className="!m-0"
            onChange={(e) => $full_name(e.target.value)}
          />
        </BaseInput>
      </td>
      <td className="!p-0">
        <BaseInput className="!m-1">
          <MainInput
            className="!m-0"
            onChange={(e) => $username(e.target.value)}
          />
        </BaseInput>
      </td>
    </>
  );
};

export default UsersFilter;
