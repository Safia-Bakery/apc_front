import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import styles from "./index.module.scss";
import { NavLink, useMatch } from "react-router-dom";
import cl from "classnames";
import { Screens } from "src/utils/types";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import Subroutes from "./CustomSubItems";
import { sidebarHandler, toggleSidebar } from "src/redux/reducers/selects";
import useToken from "src/hooks/useToken";
import { permissioms as me } from "src/utils/helpers";
import { categorySelector } from "src/redux/reducers/cache";
import { useMemo } from "react";

const CustomSidebar = () => {
  const collapsed = useAppSelector(toggleSidebar);
  const dispatch = useAppDispatch();
  const { data: user } = useToken({ enabled: false });
  //@ts-ignore
  const isSuperAdmin = user?.permissions === "*";
  const handleOverlay = () => dispatch(sidebarHandler(!collapsed));
  const categories = useAppSelector(categorySelector);

  const routes = useMemo(() => {
    return [
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
        name: "APC",
        icon: "/assets/icons/orders.svg",
        screen: Screens.requests || Screens.brigada || Screens.warehouse,
        subroutes: [
          {
            name: "Заявки",
            url: "/requests-apc",
            icon: "/assets/icons/orders.svg",
            screen: Screens.requests,
          },
          {
            name: "Бригады",
            url: "/brigades",
            icon: "/assets/icons/brigades.svg",
            screen: Screens.brigada,
          },
          {
            name: "Остатки на складах",
            url: "/items-in-stock",
            icon: "/assets/icons/remains-in-stock.svg",
            screen: Screens.warehouse,
          },
        ],
      },
      {
        name: "Инвентарь",
        icon: "/assets/icons/orders.svg",
        screen: Screens.requests,
        subroutes: [
          {
            name: "Заявки",
            url: "/requests-inventory",
            icon: "/assets/icons/orders.svg",
            screen: Screens.requests,
          },
        ],
      },

      {
        name: "IT",
        icon: "/assets/icons/orders.svg",
        screen: Screens.requests,
        subroutes: [
          {
            name: "Заявки",
            url: "/requests-it",
            icon: "/assets/icons/orders.svg",
            screen: Screens.requests,
          },
        ],
      },

      {
        name: "Маркетинг",
        icon: "/assets/icons/orders.svg",
        screen: Screens.requests,
        subroutes: [
          {
            name: "Заявки",
            url: "/requests-it",
            icon: "/assets/icons/orders.svg",
            screen: Screens.requests,
          },
          // ...categories?.map((cat) => {
          //   return {
          //     name: cat?.name,
          //     url: `/requests-${cat?.id}`,
          //     icon: "/assets/icons/orders.svg",
          //     screen: Screens.requests,
          //   };
          // }),
        ],
      },
      {
        name: "Категории",
        url: "/categories",
        icon: "/assets/icons/categories.svg",
        screen: Screens.category,
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
  }, [categories, user?.permissions]);

  if (!user) return;
  return (
    <Sidebar
      backgroundColor="#FB404B"
      className={cl(styles.sidebar, "customSidebar", {
        [cl(styles.collapsed, "collapsed")]: collapsed,
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
          if ((isSuperAdmin ? me : user.permissions)?.[item.screen]) {
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
