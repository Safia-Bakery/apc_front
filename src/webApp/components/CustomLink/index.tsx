import cl from "classnames";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  to: string;
  children?: ReactNode;
  className?: string;
};

const CustomLink = ({ to, children, className }: Props) => {
  return (
    <Link
      to={"/tg/inventory-request/" + to + window?.location?.search}
      className={cl(className, "!text-start")}
    >
      {children}
    </Link>
  );
};

export default CustomLink;
