import useDebounce from "custom/useDebounce";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import { useNavigateParams } from "custom/useCustomNavigate";
import useUpdateEffect from "custom/useUpdateEffect";
import MainSelect from "@/components/BaseInputs/MainSelect";
import { StatusName } from "@/utils/helpers";

const ParentToolsFilter = () => {
  const navigate = useNavigateParams();
  const [name, $name] = useDebounce<string>("");

  useUpdateEffect(() => {
    navigate({ name });
  }, [name]);

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput className="!m-0" onChange={(e) => $name(e.target.value)} />
        </BaseInput>
      </td>

      <td className="p-0">
        <BaseInput className="!m-1">
          <MainSelect
            values={StatusName}
            onChange={(e) => navigate({ status: e.target.value })}
            className="!m-0"
          />
        </BaseInput>
      </td>
      <td></td>
    </>
  );
};

export default ParentToolsFilter;
