import { ChangeEvent, FC } from "react";
import BaseInputs from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import MainSelect from "@/components/BaseInputs/MainSelect";
import { useNavigateParams } from "custom/useCustomNavigate";
import useDebounce from "custom/useDebounce";
import useQueryString from "custom/useQueryString";
import useUpdateEffect from "@/hooks/useUpdateEffect";
import { RegionNames, StatusName } from "@/utils/helpers";

const BranchesFilter: FC = () => {
  const navigate = useNavigateParams();
  const [name, $name] = useDebounce("");
  const [latitude, $latitude] = useDebounce<number>(0);
  const [longitude, $longitude] = useDebounce<number>(0);
  const fillial_status = useQueryString("fillial_status");
  const country = useQueryString("country");

  useUpdateEffect(() => {
    navigate({ name });
  }, [name]);

  const handleName = (e: ChangeEvent<HTMLInputElement>) =>
    $name(e.target.value);

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainInput className="!mb-0" onChange={handleName} />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainSelect
            values={RegionNames}
            value={country?.toString()}
            onChange={(e) => navigate({ country: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainInput
            className="!mb-0"
            type="number"
            onChange={(e) => $latitude(Number(e.target.value))}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainInput
            className="!mb-0"
            type="number"
            onChange={(e) => $longitude(Number(e.target.value))}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="!m-1">
          <MainSelect
            values={StatusName}
            value={fillial_status?.toString()}
            onChange={(e) => navigate({ fillial_status: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td></td>
    </>
  );
};

export default BranchesFilter;
