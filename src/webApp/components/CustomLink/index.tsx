import cl from "classnames";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  to: string;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
};

const CustomLink = ({ to, children, className, disabled }: Props) => {
  return !disabled ? (
    <Link
      to={"/tg/inventory-request/" + to + window?.location?.search}
      className={cl(className, "!text-start")}
    >
      {children}
    </Link>
  ) : (
    <div className={cl(className, "!text-start opacity-30")}>{children}</div>
  );
};

export default CustomLink;
