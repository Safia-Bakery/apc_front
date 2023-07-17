import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import styles from "./index.module.scss";
import { NavLink, useMatch } from "react-router-dom";
import cl from "classnames";
import { Screens } from "src/utils/types";
import { useAppSelector } from "src/redux/utils/types";
import { roleSelector } from "src/redux/reducers/authReducer";
import Subroutes from "./CustomSubRoutes";

const routes = [
  {
    name: "Статистика",
    url: "/statistics",
    icon: "/assets/icons/statistics.svg",
    screen: Screens.statistics,
  },
  {
    name: "Тепловая карта",
    url: "/map",
    icon: "/assets/icons/map.svg",
    screen: Screens.maps,
  },
  {
    name: "Заявки",
    url: "/orders",
    icon: "/assets/icons/orders.svg",
    screen: Screens.requests,
  },
  {
    name: "Категории",
    url: "/categories",
    icon: "/assets/icons/categories.svg",
    screen: Screens.category,
  },
  {
    name: "Остатки на складах",
    url: "/items-in-stock",
    icon: "/assets/icons/remains-in-stock.svg",
    screen: Screens.warehouse,
  },
  {
    name: "Бригады",
    url: "/brigades",
    icon: "/assets/icons/brigades.svg",
    screen: Screens.brigadas,
  },
  {
    name: "Пользователи",
    url: "/users",
    icon: "/assets/icons/users.svg",
    screen: Screens.users,
  },
  {
    name: "Роли",
    url: "/roles",
    icon: "/assets/icons/roles.svg",
    screen: Screens.roles,
  },
  {
    name: "Отзывы",
    url: "/comments",
    icon: "/assets/icons/comments.svg",
    screen: Screens.comments,
  },
  {
    name: "Настройки",
    icon: "/assets/icons/settings.svg",
    subroutes: [
      {
        name: "Филлиалы",
        url: "/branches",
        icon: "/assets/icons/settings.svg",
        screen: Screens.fillials,
      },
    ],
  },
];

const CustomSidebar = () => {
  const user = useAppSelector(roleSelector);

  if (!user) return;
  return (
    <Sidebar
      backgroundColor="#d5302c"
      className={styles.sidebar}
      rootStyles={{
        color: "white",
        height: "100%",
        position: "fixed",
        top: 0,
        zIndex: 100,
      }}
    >
      <div className="w-100 d-flex flex-column">
        <h3 className="pointer mb-0 pl-2">APC</h3>
        <p className={cl("mb-0 pl-2 ", styles.descr)}>
          <small>Аварийно-ремонтные службы</small>
        </p>
      </div>
      <Menu
        menuItemStyles={{
          subMenuContent: ({ level }) => ({
            backgroundColor: level === 0 ? "#922624" : "transparent",
          }),
        }}
      >
        <MenuItem
          icon={
            <img
              height={30}
              width={30}
              src={"/assets/icons/controlPanel.svg"}
            />
          }
          className={cl(styles.menuItem, {
            [styles.active]: useMatch("/"),
          })}
          component={<NavLink to={"/"} />}
        >
          Панель управления
        </MenuItem>
        {routes.map((item) => {
          if (item.screen && user?.permissions[item.screen])
            return (
              <MenuItem
                key={item.name + item.url}
                icon={<img height={30} width={30} src={item.icon || ""} />}
                className={cl(styles.menuItem, {
                  [styles.active]: item.url && useMatch(item.url),
                })}
                component={<NavLink to={item.url || ""} />}
              >
                {item.name}
              </MenuItem>
            );

          if (item.subroutes?.length)
            return (
              <Subroutes
                key={item.name + item.url}
                subroutes={item.subroutes}
                routeIcon={item.icon}
                routeName={item.name}
              />
            );
          return null;
        })}
      </Menu>
    </Sidebar>
  );
};

export default CustomSidebar;
