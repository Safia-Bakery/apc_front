import { MenuItem, SubMenu } from "react-pro-sidebar";
import styles from "./index.module.scss";
import { Link, useMatch } from "react-router-dom";
import cl from "classnames";
import { FC } from "react";
import { Screens } from "src/utils/types";
import { roleSelector } from "src/redux/reducers/authReducer";
import { useAppSelector } from "src/redux/utils/types";

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
  const user = useAppSelector(roleSelector);
  return (
    <SubMenu
      icon={<img height={30} width={30} src={routeIcon} />}
      label={routeName}
      rootStyles={{
        background: "#d5302c",
        backgroundColor: "#d5302c",
      }}
      className={styles.menuItem}
    >
      {subroutes.map((sub) => {
        if (user?.permissions[sub.screen])
          return (
            <MenuItem
              key={sub.url + sub.name}
              icon={<img height={30} width={30} src={sub.icon} />}
              className={cl(styles.menuItem, {
                [styles.active]: useMatch(sub.url),
              })}
              component={<Link to={sub.url} />}
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
