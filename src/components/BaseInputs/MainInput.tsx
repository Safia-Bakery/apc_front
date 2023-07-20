import { ChangeEvent, FC, HTMLInputTypeAttribute } from "react";
import cl from "classnames";

interface Props {
  onChange?: (val: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  value?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string | null;
  autoFocus?: boolean;
  disabled?: boolean;
  register?: Object;
}

const MainInput: FC<Props> = ({
  className,
  placeholder = "",
  register,
  ...others
}) => {
  return (
    <input
      className={cl(className, "form-control mb-2")}
      placeholder={placeholder || ""}
      {...register}
      {...others}
    />
  );
};

export default MainInput;
