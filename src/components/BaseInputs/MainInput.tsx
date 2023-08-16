import { ChangeEvent, FC, HTMLInputTypeAttribute } from "react";
import cl from "classnames";
import { UseFormRegisterReturn } from "react-hook-form";
import styles from "./index.module.scss";

interface Props {
  onChange?: (val: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  value?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string | null;
  autoFocus?: boolean;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
}

const MainInput: FC<Props> = ({
  className,
  placeholder = "",
  register,
  ...others
}) => {
  return (
    <input
      className={cl(className, "form-control mb-2", styles.tinputBox)}
      placeholder={placeholder || ""}
      {...register}
      {...others}
    />
  );
};

export default MainInput;
