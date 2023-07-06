import { ChangeEvent, FC } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface Props {
  onChange?: (val: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  value?: string;
  inputType?: "text" | "password" | "email" | "number" | "date" | "time";
  placeholder?: string | null;
  autoFocus?: boolean;
  onFocus?: () => void;
  disabled?: boolean;
  label?: string;
  register?: Object;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

const InputBlock: FC<Props> = ({
  className,
  value,
  onChange,
  inputType = "text",
  placeholder = "",
  onFocus,
  autoFocus,
  disabled = false,
  label,
  register,
  error,
}) => {
  return (
    <div>
      {label && <label>{label}</label>}
      <input
        {...register}
        disabled={disabled}
        className={className}
        type={inputType}
        value={value}
        onFocus={onFocus}
        autoFocus={autoFocus}
        placeholder={placeholder || ""}
        onChange={onChange}
      />
      {error && (
        <div className="alert alert-danger p-2" role="alert">
          {error?.message?.toString()}
        </div>
      )}
    </div>
  );
};

export default InputBlock;
