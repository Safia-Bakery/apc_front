import { FC, useEffect, useRef } from "react";
import BaseInputs from "src/components/BaseInputs";
import MainInput from "src/components/BaseInputs/MainInput";
import MainSelect from "src/components/BaseInputs/MainSelect";
import { useNavigateParams } from "src/hooks/useCustomNavigate";
import useDebounce from "src/hooks/useDebounce";
import useQueryString from "src/hooks/useQueryString";
import { RegionNames, StatusName } from "src/utils/helpers";

const BranchesFilter: FC = () => {
  const navigate = useNavigateParams();
  const initialLoadRef = useRef(true);
  const [name, $name] = useDebounce("");
  const [latitude, $latitude] = useDebounce<number>(0);
  const [longitude, $longitude] = useDebounce<number>(0);
  const fillial_status = useQueryString("fillial_status");
  const country = useQueryString("country");

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    const navigateAsync = async () => {
      await navigate({ name });
    };

    navigateAsync();
  }, [name]);

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainInput onChange={(e) => $name(e.target.value)} />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="mb-0">
          <MainSelect
            values={RegionNames}
            value={country?.toString()}
            onChange={(e) => navigate({ country: e.target.value })}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainInput
            type="number"
            onChange={(e) => $latitude(Number(e.target.value))}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="m-2">
          <MainInput
            type="number"
            onChange={(e) => $longitude(Number(e.target.value))}
          />
        </BaseInputs>
      </td>
      <td className="p-0">
        <BaseInputs className="mb-0">
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
