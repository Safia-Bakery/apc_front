import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import styles from "./index.module.scss";
import { NavLink, useMatch } from "react-router-dom";
import cl from "classnames";
import { Departments, MainPerm, MarketingSubDep } from "src/utils/types";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import Subroutes from "./CustomSubItems";
import { sidebarHandler, toggleSidebar } from "src/redux/reducers/selects";
import { isMobile } from "src/utils/helpers";
import { permissionSelector } from "src/redux/reducers/auth";

const routes = [
  {
    name: "Статистика",
    url: "/statistics",
    icon: "/assets/icons/statistics.svg",
    screen: MainPerm.get_statistics,
  },
  {
    name: "Тепловая карта",
    url: "/map",
    icon: "/assets/icons/map.svg",
    screen: MainPerm.get_map,
  },
  {
    name: "APC",
    icon: "/assets/icons/apc.svg",
    screen:
      MainPerm.get_requests_apc ||
      MainPerm.get_brigadas ||
      MainPerm.get_warehouse,
    subroutes: [
      {
        name: "Заявки",
        url: "/requests-apc",
        icon: "/assets/icons/subOrder.svg",
        screen: MainPerm.get_requests_apc,
      },
      {
        name: "Бригады",
        url: "/brigades",
        icon: "/assets/icons/brigades.svg",
        screen: MainPerm.get_brigadas,
      },
      {
        name: "Остатки на складах",
        url: "/items-in-stock",
        icon: "/assets/icons/remains-in-stock.svg",
        screen: MainPerm.get_warehouse,
      },
    ],
  },
  // {
  //   name: "Инвентарь",
  //   icon: "/assets/icons/inventary.svg",
  //   screen: MainPerm.,
  //   subroutes: [
  //     {
  //       name: "Заявки",
  //       url: "/requests-inventory",
  //       icon: "/assets/icons/subOrder.svg",
  //       screen: MainPerm.requests_inventory,
  //     },
  //   ],
  // },

  // {
  //   name: "IT",
  //   icon: "/assets/icons/it.svg",
  //   screen: MainPerm.requests_it,
  //   subroutes: [
  //     {
  //       name: "Заявки",
  //       url: "/requests-designer",
  //       icon: "/assets/icons/subOrder.svg",
  //       screen: MainPerm.requests_it,
  //     },
  //   ],
  // },

  {
    name: "Маркетинг",
    icon: "/assets/icons/marketing.svg",
    screen: MainPerm.get_locmar_requests,
    subroutes: [
      {
        name: "Проектная работа для дизайнеров",
        url: `/marketing-${MarketingSubDep[1]}?sub_id=${MarketingSubDep.designers}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPerm.get_design_request,
      },
      {
        name: "Локальный маркетинг",
        url: `/marketing-${MarketingSubDep[2]}?sub_id=${MarketingSubDep.local_marketing}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPerm.get_locmar_requests,
      },
      {
        name: "Промо-продукция",
        url: `/marketing-${MarketingSubDep[3]}?sub_id=${MarketingSubDep.promo_production}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPerm.get_promo_requests,
      },
      {
        name: "POS-Материалы",
        url: `/marketing-${MarketingSubDep[4]}?sub_id=${MarketingSubDep.pos}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPerm.get_pos_requests,
      },
      {
        name: "Комплекты",
        url: `/marketing-${MarketingSubDep[5]}?sub_id=${MarketingSubDep.complects}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPerm.get_requests_apc,
      },
      {
        name: "Категории",
        url: `/categories-marketing?dep=${Departments.marketing}`,
        icon: "/assets/icons/categories.svg",
        screen: MainPerm.get_category,
      },
    ],
  },
  {
    name: "Категории",
    url: "/categories",
    icon: "/assets/icons/categories.svg",
    screen: MainPerm.get_category,
  },
  {
    name: "Пользователи",
    url: "/users",
    icon: "/assets/icons/users.svg",
    screen: MainPerm.get_users,
  },
  {
    name: "Роли",
    url: "/roles",
    icon: "/assets/icons/roles.svg",
    screen: MainPerm.get_roles,
  },
  {
    name: "Отзывы",
    url: "/comments",
    icon: "/assets/icons/comments.svg",
    screen: MainPerm.get_comments_list,
  },
  {
    name: "Настройки",
    icon: "/assets/icons/settings.svg",
    screen: MainPerm.get_fillials_list,
    subroutes: [
      {
        name: "Филиалы",
        url: "/branches",
        icon: "/assets/icons/branch.svg",
        screen: MainPerm.get_fillials_list,
      },
    ],
  },
];

const CustomSidebar = () => {
  const collapsed = useAppSelector(toggleSidebar);
  const dispatch = useAppDispatch();
  const handleOverlay = () => dispatch(sidebarHandler(!collapsed));
  const permission = useAppSelector(permissionSelector);

  if (!permission) return;
  return (
    <Sidebar
      backgroundColor="#FB404B"
      className={cl(styles.sidebar, "customSidebar", {
        [cl(styles.collapsed, "collapsed")]: collapsed,
      })}
      rootStyles={{
        color: "white",
        height: "100lvh",
        position: "fixed",
        top: 0,
        zIndex: 100,
      }}
    >
      <div className={styles.logo}>
        <h3 className={styles.title}>Service</h3>
        <p className={styles.subTitle}>АРС / Inventory / IT / Marketing</p>
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
          component={
            <NavLink
              to={"/"}
              onClick={() => isMobile && dispatch(sidebarHandler(false))}
            />
          }
        >
          Панель управления
        </MenuItem>
        {routes.map((item) => {
          if (permission?.[item.screen]) {
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
                  <NavLink
                    onClick={() =>
                      !item.subroutes?.length &&
                      isMobile &&
                      dispatch(sidebarHandler(false))
                    }
                    state={{ name: item.name }}
                    to={item.url || ""}
                  />
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
