import {
  ChangeEvent,
  FC,
  HTMLInputTypeAttribute,
  KeyboardEventHandler,
} from "react";
import cl from "classnames";
import { UseFormRegisterReturn } from "react-hook-form";
import styles from "./index.module.scss";
import { withMask } from "use-mask-input";

interface Props {
  onChange?: (val: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  value?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string | null;
  autoFocus?: boolean;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
  onFocus?: () => void;
  ref?: any;
  defaultValue?: any;
  onKeyDown?: KeyboardEventHandler;
  onSubmit?: () => void;
  mask?: string;
}

const MainInput: FC<Props> = ({
  className,
  placeholder = "",
  register,
  ref,
  mask,
  defaultValue,
  ...others
}) => {
  return (
    <input
      className={cl(className, "form-control mb-2", styles.inputBox)}
      placeholder={placeholder || ""}
      ref={withMask(mask as any)}
      // @ts-ignore
      onWheel={(e) => e.target?.blur()}
      defaultValue={defaultValue}
      // {...register}
      {...others}
    />
  );
};

export default MainInput;
