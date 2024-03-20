import { ChangeEvent, FC, useEffect } from "react";
import useDebounce from "custom/useDebounce";
import BaseInput from "@/components/BaseInputs";
import MainInput from "@/components/BaseInputs/MainInput";
import { useNavigateParams } from "custom/useCustomNavigate";
import { useForm } from "react-hook-form";
import useQueryString from "@/hooks/custom/useQueryString";

const InventoryRemainsFilter: FC = () => {
  const navigate = useNavigateParams();
  const name = useQueryString("name");

  const { register, reset, getValues } = useForm();
  const handleSubmit = () => navigate({ name: getValues("name") });

  useEffect(() => {
    if (!!name) reset({ name });
  }, []);

  return (
    <>
      <td></td>
      <td className="p-0">
        <BaseInput className="!m-1">
          <MainInput
            register={register("name")}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="!mb-0"
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
