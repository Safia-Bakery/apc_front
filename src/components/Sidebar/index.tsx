import styles from "./index.module.scss";
import { Link, useLocation } from "react-router-dom";
import cl from "classnames";
import { MainPermissions, MarketingSubDep, Sphere } from "src/utils/types";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import { sidebarHandler, toggleSidebar } from "src/redux/reducers/selects";
import { isMobile, stockStores } from "src/utils/helpers";
import { logoutHandler, permissionSelector } from "src/redux/reducers/auth";
import useToken from "src/hooks/useToken";
import { useState } from "react";

const routes = [
  // {
  //   name: "Статистика",
  //   url: "/statistics",
  //   icon: "/assets/icons/statistics.svg",
  //   screen: MainPermissions.get_statistics,
  // },
  {
    name: "Тепловая карта",
    url: "/map",
    icon: "/assets/icons/map.svg",
    screen: MainPermissions.get_map,
  },
  {
    name: "АРС розница",
    icon: "/assets/icons/apc.svg",
    screen: MainPermissions.get_requests_apc,
    subroutes: [
      {
        name: "Заявки на APC розница",
        url: "/requests-apc-retail",
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_requests_apc,
        param: `?sphere_status=${Sphere.retail}&addExp=${MainPermissions.request_add_expanditure}`,
      },
      {
        name: "Бригады",
        url: "/brigades",
        icon: "/assets/icons/brigades.svg",
        screen: MainPermissions.get_brigadas,
        param: `?sphere_status=${Sphere.retail}`,
      },
      {
        name: "Остатки на складах",
        url: "/items-in-stock",
        icon: "/assets/icons/remains-in-stock.svg",
        param: `/${stockStores.retail}`,
        screen: MainPermissions.get_warehouse_retail,
      },
      {
        name: "Категории",
        url: `/categories-apc-retail`,
        icon: "/assets/icons/categories.svg",
        screen: MainPermissions.get_apc_category,
      },
      {
        name: "Статистика",
        url: "/statistics-apc-retail",
        param: "/category",
        icon: "/assets/icons/statistics.svg",
        screen: MainPermissions.get_statistics,
      },
    ],
  },
  {
    name: "АРС фабрика",
    icon: "/assets/icons/apc.svg",
    screen: MainPermissions.get_fabric_requests,
    subroutes: [
      {
        name: "Заявки на APC фабрика",
        url: "/requests-apc-fabric",
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_fabric_requests,
        param: `?sphere_status=${Sphere.fabric}&addExp=${MainPermissions.add_expen_fab}`,
      },
      {
        name: "Мастера",
        url: "/masters",
        icon: "/assets/icons/brigades.svg",
        screen: MainPermissions.get_master,
        param: `?sphere_status=${Sphere.fabric}`,
      },
      {
        name: "Категории",
        url: `/categories-apc-fabric`,
        icon: "/assets/icons/categories.svg",
        screen: MainPermissions.get_categ_fab,
      },

      {
        name: "Остатки на складах",
        url: "/items-in-stock",
        icon: "/assets/icons/remains-in-stock.svg",
        param: `/${stockStores.fabric}`,
        screen: MainPermissions.get_warehouse_fabric,
      },
      {
        name: "Статистика",
        url: "/statistics-apc-fabric",
        icon: "/assets/icons/statistics.svg",
        param: "/category",
        screen: MainPermissions.get_statistics,
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
    screen: MainPermissions.get_design_request,
    subroutes: [
      {
        name: "Проектная работа для дизайнеров",
        url: `/marketing-${MarketingSubDep[1]}`,
        icon: "/assets/icons/subOrder.svg",
        param: `?add=${MainPermissions.add_design_request}&edit=${MainPermissions.edit_design_request}&title=Проектная работа для дизайнеров&sub_id=${MarketingSubDep.designers}`,
        screen: MainPermissions.get_design_request,
      },
      {
        name: "Локальный маркетинг",
        url: `/marketing-${MarketingSubDep[2]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_locmar_requests,
        param: `?add=${MainPermissions.add_locmar_requests}&edit=${MainPermissions.edit_locmar_requests}&title=Локальный маркетинг&sub_id=${MarketingSubDep.local_marketing}`,
      },
      {
        name: "Промо-продукция",
        url: `/marketing-${MarketingSubDep[3]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_promo_requests,
        param: `?add=${MainPermissions.add_promo_requests}&edit=${MainPermissions.edit_promo_requests}&title=Промо-продукция&sub_id=${MarketingSubDep.promo_production}`,
      },
      {
        name: "POS-Материалы",
        url: `/marketing-${MarketingSubDep[4]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_pos_requests,
        param: `?add=${MainPermissions.add_pos_requests}&edit=${MainPermissions.edit_pos_requests}&title=POS-Материалы&sub_id=${MarketingSubDep.pos}`,
      },
      {
        name: "Комплекты",
        url: `/marketing-${MarketingSubDep[5]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_complect_requests,
        param: `?add=${MainPermissions.add_complect_requests}&edit=${MainPermissions.edit_complect_requests}&title=Комплекты&sub_id=${MarketingSubDep.complects}`,
      },
      {
        name: "Нестандартные рекламные решения",
        url: `/marketing-${MarketingSubDep[6]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_nostandard_requests,
        param: `?add=${MainPermissions.add_nostandard_requests}&edit=${MainPermissions.edit_nostandard_requests}&title=Нестандартные рекламные решения&sub_id=${MarketingSubDep.nonstandartAdv}`,
      },
      {
        name: "Внешний вид филиала",
        url: `/marketing-${MarketingSubDep[7]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_stock_env_requests,
        param: `?add=${MainPermissions.add_stock_env_requests}&edit=${MainPermissions.edit_stock_env_requests}&title=Внешний вид филиала&sub_id=${MarketingSubDep.branchEnv}`,
      },
      {
        name: "Категории",
        url: `/categories-marketing`,
        icon: "/assets/icons/categories.svg",
        screen: MainPermissions.get_mark_category,
      },
      {
        name: "Статистика",
        url: "/statistics-marketing",
        icon: "/assets/icons/statistics.svg",
        screen: MainPermissions.get_statistics,
      },
    ],
  },
  {
    name: "Запрос машин",
    icon: "/assets/icons/apc.svg",
    screen: MainPermissions.get_log_requests,
    subroutes: [
      {
        name: "Заявки на Запрос машин",
        url: "/requests-logystics",
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_log_requests,
      },
      {
        name: "Категории",
        url: `/categories-logystics`,
        icon: "/assets/icons/categories.svg",
        screen: MainPermissions.get_log_categs,
      },
    ],
  },
  {
    name: "Пользователи",
    url: "/users",
    icon: "/assets/icons/users.svg",
    screen: MainPermissions.get_users,
  },
  {
    name: "Клиенты",
    url: "/clients",
    icon: "/assets/icons/clients.svg",
    screen: MainPermissions.get_clients,
    param: "?client=true",
  },
  {
    name: "Роли",
    url: "/roles",
    icon: "/assets/icons/roles.svg",
    screen: MainPermissions.get_roles,
  },
  {
    name: "Отзывы",
    url: "/comments",
    icon: "/assets/icons/comments.svg",
    screen: MainPermissions.get_comments_list,
  },
  {
    name: "Настройки",
    icon: "/assets/icons/settings.svg",
    screen: MainPermissions.get_fillials_list,
    subroutes: [
      {
        name: "Филиалы",
        url: "/branches",
        icon: "/assets/icons/branch.svg",
        screen: MainPermissions.get_fillials_list,
      },
    ],
  },
];

const CustomSidebar = () => {
  const collapsed = useAppSelector(toggleSidebar);
  const dispatch = useAppDispatch();
  const handleOverlay = () => dispatch(sidebarHandler(!collapsed));
  const permission = useAppSelector(permissionSelector);
  const { pathname } = useLocation();

  const [menuItem, $menuItem] = useState<MainPermissions>();

  const toggleSubItems = (item: MainPermissions) => {
    if (item === menuItem) $menuItem(undefined);
    else $menuItem(item);
  };

  const handleLogout = () => dispatch(logoutHandler());

  const { data: me } = useToken({ enabled: false });

  if (!permission) return;
  return (
    <>
      {collapsed && <div className={styles.overlay} onClick={handleOverlay} />}
      <div
        className={cl(styles.sidebar, "sidebar", {
          [styles.collapsed]: collapsed,
        })}
      >
        <div className="d-flex flex-column justify-content-between position-relative z-3">
          <div className={styles.logo}>
            <h3 className={styles.title}>Service</h3>
            <p className={styles.subTitle}>АРС / Inventory / IT / Marketing</p>
          </div>
          <ul className="nav flex-column d-flex">
            <li className={cl("nav-item")}>
              <Link
                className={cl(
                  "nav-link d-flex align-items-center",
                  styles.link,
                  {
                    [styles.active]: pathname === "/home",
                  }
                )}
                onClick={() => isMobile && dispatch(sidebarHandler(false))}
                to={"/home"}
              >
                <img
                  height={20}
                  width={20}
                  src={"/assets/icons/controlPanel.svg"}
                  className={styles.routeIcon}
                />
                <p className={styles.content}>Панель управления</p>
              </Link>
            </li>
            {routes.map((route) => {
              // if (permission?.[route?.screen]) {
              if (
                permission?.[route?.screen] ||
                (route?.subroutes &&
                  route.subroutes.some(
                    (subroute) => permission[subroute.screen]
                  ))
              ) {
                if (route?.subroutes?.length) {
                  const activeRoute = menuItem === route.screen;
                  return (
                    <li className="nav-item" key={route.url + route.name}>
                      <a
                        className={cl("nav-link d-flex", styles.link, {
                          ["show"]: activeRoute,
                        })}
                        onClick={() => toggleSubItems(route.screen)}
                        href={`#${route.screen}`}
                      >
                        <img
                          height={20}
                          width={20}
                          src={route.icon || ""}
                          className={styles.routeIcon}
                        />
                        <p className={styles.content}>
                          {route.name}
                          <img
                            src="/assets/icons/arrow.svg"
                            alt="arrow"
                            className={cl({
                              [styles.activeImage]: activeRoute,
                            })}
                            width={15}
                            height={15}
                          />
                        </p>
                      </a>
                      <div
                        className={cl("collapse", {
                          ["show"]: activeRoute,
                        })}
                        id="subItems"
                      >
                        <ul className={cl("nav flex-column", styles.submenu)}>
                          {route?.subroutes?.map((subroute) => {
                            if (permission?.[subroute?.screen])
                              return (
                                <li
                                  className={cl("nav-item")}
                                  key={subroute.url + subroute.name}
                                >
                                  <Link
                                    className={cl(
                                      "nav-link d-flex align-items-center",
                                      styles.link,
                                      {
                                        [styles.active]: pathname.includes(
                                          subroute.url
                                        ),
                                      }
                                    )}
                                    onClick={() =>
                                      isMobile &&
                                      dispatch(sidebarHandler(false))
                                    }
                                    to={`${subroute.url}${
                                      !!subroute?.param ? subroute?.param : ""
                                    }`}
                                    state={{ name: subroute.name }}
                                  >
                                    <img
                                      height={20}
                                      width={20}
                                      src={subroute.icon || ""}
                                      className={styles.routeIcon}
                                    />
                                    <p className={styles.content}>
                                      {subroute.name}
                                    </p>
                                  </Link>
                                </li>
                              );
                          })}
                        </ul>
                      </div>
                    </li>
                  );
                }

                return (
                  <li className={cl("nav-item")} key={route.url + route.name}>
                    <Link
                      className={cl(
                        "nav-link d-flex align-items-center",
                        styles.link,
                        {
                          [styles.active]: pathname.includes(route.url!),
                        }
                      )}
                      onClick={() =>
                        isMobile && dispatch(sidebarHandler(false))
                      }
                      to={`${route.url}${!!route?.param ? route?.param : ""}`}
                      state={{ name: route.name }}
                    >
                      <img
                        height={20}
                        width={20}
                        src={route.icon || ""}
                        className={styles.routeIcon}
                      />
                      <p className={styles.content}>{route.name}</p>
                      {/* <span className={styles.menuItem}>{route.name}</span> */}
                    </Link>
                  </li>
                );
              }
              // }
              // return null;
            })}
          </ul>
        </div>
        <span onClick={handleLogout} className={styles.logout}>
          Выйти ({me?.username})
        </span>
      </div>
    </>
  );
};

export default CustomSidebar;
