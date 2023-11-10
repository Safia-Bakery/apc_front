import { FC, PropsWithChildren } from "react";
import styles from "./index.module.scss";
import cl from "classnames";
import { useLocation } from "react-router-dom";

interface Props extends PropsWithChildren {
  title?: string;
  subTitle?: string;
}

const Header: FC<Props> = ({ children, title, subTitle }) => {
  const location = useLocation();

  return (
    <>
      <div className={cl(styles.header)}>
        <div className="pull-left">
          <h2 className={styles.title}>{title || location?.state?.name}</h2>
          {subTitle && <p className="mb-0">{subTitle}</p>}
        </div>
        <div className="pull-right">{children}</div>
      </div>
      <hr />
    </>
  );
};

export default Header;
