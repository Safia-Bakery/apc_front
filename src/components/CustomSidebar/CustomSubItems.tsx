import { MenuItem, SubMenu } from "react-pro-sidebar";
import styles from "./index.module.scss";
import { Link, useMatch } from "react-router-dom";
import cl from "classnames";
import { FC, useState } from "react";
import { Screens } from "src/utils/types";
import useToken from "src/hooks/useToken";
import { isMobile, permissioms as me } from "src/utils/helpers";
import { sidebarHandler } from "src/redux/reducers/selects";
import { useAppDispatch } from "src/redux/utils/types";

interface Item {
  name: string;
  url: string;
  icon: string;
  screen: Screens;
}

interface Props {
  subroutes: Item[];
  routeName: string;
  routeIcon: string;
}

const Subroutes: FC<Props> = ({ subroutes, routeIcon, routeName }) => {
  const dispatch = useAppDispatch();
  const { data: user } = useToken({ enabled: false });
  //@ts-ignore
  const isSuperAdmin = user?.permissions === "*";

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
        if ((isSuperAdmin ? me : user?.permissions)?.[sub.screen])
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
                  to={sub.url}
                  state={{ name: sub.name }}
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
