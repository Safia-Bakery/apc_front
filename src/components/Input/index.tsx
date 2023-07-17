import { ChangeEvent, FC } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import styles from "./index.module.scss";
import cl from "classnames";

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
  blockClass?: string;
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
  blockClass,
  error,
}) => {
  return (
    <div className={cl("form-group", blockClass)}>
      {label && <label className={styles.label}>{label}</label>}
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
