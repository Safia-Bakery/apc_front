import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import useQueryString from "@/hooks/custom/useQueryString";
import { ValueLabel } from "@/utils/types";
import { useTranslation } from "react-i18next";
import Select from "react-select";

type Props = {
  options: ValueLabel[];
};

const StatusFilter = ({ options }: Props) => {
  const navigate = useNavigateParams();
  const request_status = useQueryString("request_status");

  const statusJson = request_status
    ? (JSON.parse(request_status) as ValueLabel[])
    : undefined;

  const handleStatus = (e: any) =>
    navigate({ request_status: JSON.stringify(e) });
  return (
    <Select
      isMulti
      isClearable={false}
      placeholder={""}
      value={statusJson}
      onChange={handleStatus}
      options={options}
    />
  );
};

export default StatusFilter;
