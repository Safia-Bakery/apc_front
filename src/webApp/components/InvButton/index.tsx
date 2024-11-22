import cl from "classnames";
import styles from "./index.module.scss";
import { ReactNode } from "react";

export enum BtnSize {
  medium = "medium",
  base = "base",
}

export enum InvBtnType {
  primary = "primary",
  white = "white",
  tgPrimary = "tgPrimary",
  tgSelected = "tgSelected",
  tgLighBrown = "tgLighBrown",
}

type Props = {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
  btnSize?: BtnSize;
  disabled?: boolean;
  btnType?: InvBtnType;
};

const InvButton = ({
  children,
  className = "",
  btnSize = BtnSize.base,
  btnType = InvBtnType.primary,
  ...others
}: Props) => {
  return (
    <button
      className={`${className} ${cl(
        styles.btn,
        styles[btnSize],
        styles[btnType]
      )}`}
      {...others}
    >
      {children}
    </button>
  );
};

export default InvButton;
