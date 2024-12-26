import { FC } from "react";
import styles from "./index.module.scss";
import cl from "classnames";
import { Spin } from "antd";

interface Props {
  is_static?: boolean;
  className?: string;
}

const Loading: FC<Props> = ({ is_static = false, className }) => {
  return (
    <div
      className={cl(className, styles.wrap, { [styles.absolute]: !is_static })}
    >
      <Spin size="large" />
    </div>
  );
};

export default Loading;
