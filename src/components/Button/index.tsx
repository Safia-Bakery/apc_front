import cl from "classnames";
import { ReactNode } from "react";
import styles from "./index.module.scss";
import { BtnTypes } from "@/Types/common/btnTypes";

type Props = {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
  disabled?: boolean;
  danger?: boolean;
  id?: string;
  btnType?: BtnTypes;
};

const MyButton = ({
  children,
  className = "",
  btnType = BtnTypes.primary,
  ...others
}: Props) => {
  return (
    <button
      className={cl(className, "border-none py-2 text-base", styles[btnType])}
      {...others}
    >
      {children}
    </button>
  );
};

export default MyButton;
