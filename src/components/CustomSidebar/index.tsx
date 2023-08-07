import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import styles from "./index.module.scss";
import { NavLink, useMatch } from "react-router-dom";
import cl from "classnames";
import { Screens } from "src/utils/types";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import { roleSelector } from "src/redux/reducers/auth";
import Subroutes from "./CustomSubItems";
import { sidebarHandler, toggleSidebar } from "src/redux/reducers/selects";

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
    icon: "/assets/icons/orders.svg",
    screen:
      Screens.requests_apc || Screens.requests_inventory || Screens.requests_it,
    subroutes: [
      {
        name: "Заявки APC",
        url: "/requests-apc",
        icon: "/assets/icons/orders.svg",
        screen: Screens.requests_apc,
      },
      {
        name: "Заявки Инвентарь",
        url: "/requests-inventory",
        icon: "/assets/icons/orders.svg",
        screen: Screens.requests_inventory,
      },
      {
        name: "Заявки IT",
        url: "/requests-it",
        icon: "/assets/icons/orders.svg",
        screen: Screens.requests_it,
      },
    ],
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
    screen: Screens.brigada,
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
    screen: Screens.fillials,
    subroutes: [
      {
        name: "Филиалы",
        url: "/branches",
        icon: "/assets/icons/settings.svg",
        screen: Screens.fillials,
      },
    ],
  },
];

const CustomSidebar = () => {
  const user = useAppSelector(roleSelector);
  const collapsed = useAppSelector(toggleSidebar);
  const dispatch = useAppDispatch();

  const handleOverlay = () => {
    dispatch(sidebarHandler(!collapsed));
  };

  if (!user) return;
  return (
    <Sidebar
      backgroundColor="#FB404B"
      className={cl(styles.sidebar, "customSidebar", {
        [cl(styles.collapsed)]: collapsed,
      })}
      rootStyles={{
        color: "white",
        height: "100%",
        position: "fixed",
        top: 0,
        zIndex: 100,
      }}
    >
      <div className={cl(styles.logo)}>
        {/* <img
          src="/assets/icons/home.svg"
          alt="home"
          className={styles.logoimg}
          height={30}
          width={30}
        /> */}
        <h3 className={cl(styles.title)}>Сервис</h3>
      </div>
      <Menu
        className={styles.menu}
        menuItemStyles={{
          subMenuContent: ({ level }) => ({
            zIndex: 100,
            backgroundColor: level === 0 ? "rgba(0, 0, 0, .15)" : "transparent",
          }),
        }}
      >
        {collapsed && (
          <div className={styles.overlay} onClick={handleOverlay} />
        )}
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
          if (user?.permissions[item.screen]) {
            if (item.subroutes?.length)
              return (
                <Subroutes
                  key={item.name + item.url}
                  subroutes={item.subroutes}
                  routeIcon={item.icon}
                  routeName={item.name}
                />
              );

            return (
              <MenuItem
                key={item.name + item.url}
                icon={<img height={30} width={30} src={item.icon || ""} />}
                className={cl(styles.menuItem, {
                  [styles.active]: item.url && useMatch(item.url),
                })}
                component={
                  <NavLink state={{ name: item.name }} to={item.url || ""} />
                }
              >
                {item.name}
              </MenuItem>
            );
          }

          return null;
        })}
      </Menu>
    </Sidebar>
  );
};

export default CustomSidebar;
