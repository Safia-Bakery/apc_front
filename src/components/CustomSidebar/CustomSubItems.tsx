import { MenuItem, SubMenu } from "react-pro-sidebar";
import styles from "./index.module.scss";
import { Link, useMatch } from "react-router-dom";
import cl from "classnames";
import { FC } from "react";
import { MainPermissions } from "src/utils/types";
import { isMobile } from "src/utils/helpers";
import { sidebarHandler } from "src/redux/reducers/selects";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import { permissionSelector } from "src/redux/reducers/auth";

interface Item {
  name: string;
  url: string;
  icon: string;
  screen: MainPermissions;
  state?: string;
  param?: string;
}

interface Props {
  subroutes: Item[];
  routeName: string;
  routeIcon: string;
}

const Subroutes: FC<Props> = ({ subroutes, routeIcon, routeName }) => {
  const dispatch = useAppDispatch();
  const permission = useAppSelector(permissionSelector);

  return (
    <SubMenu
      icon={<img height={30} width={30} src={routeIcon} />}
      label={routeName}
      rootStyles={{
        background: "#FB404B",
        backgroundColor: "#FB404B",
      }}
      className={cl(styles.subMenuItem)}
    >
      {subroutes.map((sub) => {
        if (permission?.[sub.screen])
          return (
            <MenuItem
              key={sub.url + sub.name}
              rootStyles={{ margin: 10 }}
              icon={<img height={30} width={30} src={sub.icon} />}
              className={cl(styles.submenu, {
                [styles.active]: useMatch(sub.url),
              })}
              component={
                <Link
                  onClick={() => isMobile && dispatch(sidebarHandler(false))}
                  to={`${sub.url}${!!sub?.param ? sub?.param : ""}`}
                  state={{ name: sub.name, screen: sub?.state }}
                />
              }
            >
              {sub.name}
            </MenuItem>
          );
        else return null;
      })}
    </SubMenu>
  );
};

export default Subroutes;
