import { FC, PropsWithChildren } from "react";
import styles from "./index.module.scss";
import cl from "classnames";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Props extends PropsWithChildren {
  title?: string;
  subTitle?: string;
  className?: string;
}

const Header: FC<Props> = ({ children, title, subTitle, className }) => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <>
      <div className={cl(styles.header, className)}>
        <div className="pull-left">
          <h2 className={styles.title}>{t(title || location?.state?.name)}</h2>
          {subTitle && <p className="mb-0">{subTitle}</p>}
        </div>
        <div className="float-end">{children}</div>
      </div>
      <hr />
    </>
  );
};

export default Header;
