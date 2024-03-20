import { FC } from "react";
import styles from "./index.module.scss";
import cl from "classnames";
import safiaLogo from "/assets/images/safia.png";

interface Props {
  is_static?: boolean;
  className?: string;
}

const Loading: FC<Props> = ({ is_static = false, className }) => {
  return (
    <div
      className={cl(className, styles.wrap, { [styles.absolute]: !is_static })}
    >
      <img
        className={styles.loadingCircle}
        src={safiaLogo}
        height={50}
        width={50}
        alt="loading..."
      />
    </div>
  );
};

export default Loading;
