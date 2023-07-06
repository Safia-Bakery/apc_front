import { FC, PropsWithChildren } from "react";
import styles from "./index.module.scss";
import cl from "classnames";

interface Props extends PropsWithChildren {
  title: string;
}

const Header: FC<Props> = ({ children, title }) => {
  return (
    <>
      <div className={cl(styles.header)}>
        <div className="pull-left">
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className="pull-right">{children}</div>
      </div>
      <hr />
    </>
  );
};

export default Header;
