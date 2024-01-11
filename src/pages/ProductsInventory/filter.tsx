import { ChangeEvent, FC } from "react";
import useDebounce from "custom/useDebounce";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import { useNavigateParams } from "custom/useCustomNavigate";
import useUpdateEffect from "custom/useUpdateEffect";

const InventoryFilter: FC = () => {
  const navigate = useNavigateParams();
  const [name, $name] = useDebounce<string>("");

  const handleName = (e: ChangeEvent<HTMLInputElement>) =>
    $name(e.target.value);

  useUpdateEffect(() => {
    navigate({ name });
  }, [name]);

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput className="!mb-0" onChange={handleName} />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput className="!mb-0" />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput className="!mb-0" />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput className="!mb-0" />
        </BaseInput>
      </td>
      <td></td>
    </>
  );
};

export default InventoryFilter;
