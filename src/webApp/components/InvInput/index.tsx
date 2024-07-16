import cl from "classnames";
import searchIcon from "/assets/icons/search.svg";
import { ChangeEvent, HTMLInputTypeAttribute } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type Props = {
  wrapperClassName?: string;
  className?: string;
  onChange?: (val: ChangeEvent<HTMLInputElement>) => void;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  register?: UseFormRegisterReturn;
  value?: string;
};

const InvInput = ({ wrapperClassName, className, ...others }: Props) => {
  return (
    <div className={cl(wrapperClassName, "relative p-2 rounded-xl flex")}>
      <img src={searchIcon} alt="search" />
      <input
        type="text"
        className={cl(
          className,
          "bg-transparent w-full h-full px-2 outline-none"
        )}
        {...others}
      />
    </div>
  );
};

export default InvInput;
