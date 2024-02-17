import { ChangeEvent, FC, useEffect } from "react";
import useDebounce from "custom/useDebounce";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import { useNavigateParams } from "custom/useCustomNavigate";
import { useForm } from "react-hook-form";
import useQueryString from "@/hooks/custom/useQueryString";

const InventoryRemainsFilter: FC = () => {
  const navigate = useNavigateParams();
  const nameQ = useQueryString("name");

  const { register, reset } = useForm();
  const [name, $name] = useDebounce<string>("");

  const handleName = (e: ChangeEvent<HTMLInputElement>) =>
    $name(e.target.value);

  useEffect(() => {
    navigate({ name });
  }, [name]);

  useEffect(() => {
    if (!!name) reset({ name: nameQ });
  }, []);

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput
            register={register("name")}
            className="!mb-0"
            onChange={handleName}
          />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput disabled />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput disabled />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput disabled />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput disabled />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput disabled />
        </BaseInput>
      </td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput disabled />
        </BaseInput>
      </td>
      <td></td>
    </>
  );
};

export default InventoryRemainsFilter;
