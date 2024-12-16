import classNames from "classnames";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

const HrButton = ({ className, children, ...props }: Props) => {
  return (
    <div
      className={classNames(
        className,
        "flex bg-[#F9EED9] items-center rounded-2xl px-4 py-3"
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default HrButton;
