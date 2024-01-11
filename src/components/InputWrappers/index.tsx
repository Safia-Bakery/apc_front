import { forwardRef } from "react";
import BaseInputs from "../BaseInputs";
import ToolsSelect from "../ToolsSelect";
import { Departments } from "@/utils/types";
import MainInput from "../BaseInputs/MainInput";

export const SelectWrapper = forwardRef<
  HTMLInputElement,
  { field: any; type?: string; register?: any; error?: any }
>(({ field, register, error }, ref) => {
  return (
    <BaseInputs className="!mb-0" error={error}>
      <ToolsSelect
        department={Departments.inventory}
        {...field}
        ref={ref}
        register={register}
        className="!mb-0"
      />
    </BaseInputs>
  );
});

export const InputWrapper = forwardRef<
  HTMLInputElement,
  { field: any; type?: string; register?: any; error?: any }
>(({ field, type = "text", register, error }, ref) => {
  return (
    <BaseInputs className="!mb-0" error={error}>
      <MainInput
        {...field}
        ref={ref}
        type={type}
        register={register}
        className="!mb-0"
      />
    </BaseInputs>
  );
});
