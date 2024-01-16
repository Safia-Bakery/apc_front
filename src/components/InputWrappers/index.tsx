import { forwardRef } from "react";
import BaseInputs from "../BaseInputs";
import ToolsSelect from "../ToolsSelect";
import { Departments } from "@/utils/types";
import MainInput from "../BaseInputs/MainInput";

export const SelectWrapper = forwardRef<
  HTMLInputElement,
  {
    field: any;
    type?: string;
    register?: any;
    error?: any;
    department: Departments;
  }
>(({ field, register, error, department }, ref) => {
  return (
    <BaseInputs className="!mb-0" error={error}>
      <ToolsSelect
        department={department}
        {...field}
        ref={ref}
        register={register}
        className="!mb-0 z-20"
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
