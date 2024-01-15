import { ChangeEvent, FC, useEffect } from "react";
import useDebounce from "custom/useDebounce";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import { useNavigateParams } from "custom/useCustomNavigate";
import { useForm } from "react-hook-form";

const InventoryFilter: FC = () => {
  const navigate = useNavigateParams();
  const [name, $name] = useDebounce<string>("");

  const { register, reset } = useForm();

  const handleName = (e: ChangeEvent<HTMLInputElement>) =>
    $name(e.target.value);

  useEffect(() => {
    navigate({ name });
    if (!!name) reset({ name });
  }, [name]);

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput
            className="!mb-0"
            onChange={handleName}
            register={register("name")}
          />
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
