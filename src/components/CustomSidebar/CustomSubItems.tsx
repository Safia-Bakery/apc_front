import { MenuItem, SubMenu } from "react-pro-sidebar";
import styles from "./index.module.scss";
import { Link, useMatch } from "react-router-dom";
import cl from "classnames";
import { FC } from "react";
import { Screens } from "src/utils/types";
import useToken from "src/hooks/useToken";
import { permissioms as me } from "src/utils/helpers";

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
      className={styles.menuItem}
    >
      {subroutes.map((sub) => {
        if ((isSuperAdmin ? me : user?.permissions)?.[sub.screen])
          return (
            <MenuItem
              key={sub.url + sub.name}
              icon={<img height={30} width={30} src={sub.icon} />}
              className={cl(styles.menuItem, {
                [styles.active]: useMatch(sub.url),
              })}
              component={<Link to={sub.url} state={{ name: sub.name }} />}
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
