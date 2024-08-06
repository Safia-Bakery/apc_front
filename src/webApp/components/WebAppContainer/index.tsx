import cl from "classnames";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};
const WebAppContainer = ({ children, className }: Props) => {
  return <div className={cl(className, "w-full mx-auto p-3")}>{children}</div>;
};

export default WebAppContainer;
