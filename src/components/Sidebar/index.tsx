import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MainPermissions } from "@/utils/types";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { sidebarHandler, toggleSidebar } from "reducers/selects";
import { logoutHandler } from "reducers/auth";
import useToken from "@/hooks/useToken";
import { sidebatItemsSelector } from "reducers/sidebar";
import cl from "classnames";
import { isMobile } from "@/utils/helpers";
import styles from "./index.module.scss";
import CountItem from "./CountItem";

const CustomSidebar = () => {
  const collapsed = useAppSelector(toggleSidebar);
  const dispatch = useAppDispatch();
  const handleOverlay = () => dispatch(sidebarHandler(!collapsed));
  const routes = useAppSelector(sidebatItemsSelector);
  const { pathname } = useLocation();

  const [menuItem, $menuItem] = useState<MainPermissions>();

  const toggleSubItems = (item: MainPermissions) => {
    if (item === menuItem) $menuItem(undefined);
    else $menuItem(item);
  };

  const handleLogout = () => dispatch(logoutHandler());

  const { data: me } = useToken({ enabled: false });

  return (
    <>
      {collapsed && <div className={styles.overlay} onClick={handleOverlay} />}
      <div
        className={cl(styles.sidebar, "sidebar", {
          [styles.collapsed]: collapsed,
        })}
      >
        <div className="flex flex-col justify-between relative z-3">
          <div className={styles.logo}>
            <h3 className={styles.title}>Service</h3>
            <div className={styles.subTitle}>
              АРС / Inventory / IT / Marketing
            </div>
          </div>
          <ul className="nav flex-col flex">
            <li className={cl("nav-item")}>
              <Link
                className={cl("nav-link flex align-center", styles.link, {
                  [styles.active]: pathname === "/home",
                })}
                onClick={() => isMobile && dispatch(sidebarHandler(false))}
                to={"/home"}
              >
                <img
                  height={20}
                  width={20}
                  src={"/assets/icons/controlPanel.svg"}
                  className={styles.routeIcon}
                />
                <div className={styles.content}>Панель управления</div>
              </Link>
            </li>
            {routes?.map((route) => {
              if (route?.subroutes?.length) {
                const activeRoute = menuItem === route.screen;
                return (
                  <li className="nav-item" key={route.url + route.name}>
                    <a
                      className={cl("nav-link flex", styles.link, {
                        ["show"]: activeRoute,
                      })}
                      onClick={() => toggleSubItems(route.screen)}
                      href={`#${route.screen}`}
                    >
                      <img
                        height={30}
                        width={30}
                        src={route.icon || ""}
                        className={styles.routeIcon}
                      />
                      <div className={styles.content}>
                        {route.name}
                        <div className="flex">
                          {!!route.count && <CountItem count={route.count} />}
                          <img
                            src="/assets/icons/arrow.svg"
                            alt="arrow"
                            className={cl({
                              [styles.activeImage]: activeRoute,
                            })}
                            width={15}
                            height={15}
                          />
                        </div>
                      </div>
                    </a>
                    <div
                      className={cl("collapse", {
                        ["show"]: activeRoute,
                      })}
                      id="subItems"
                    >
                      <ul className={cl("nav flex-col", styles.submenu)}>
                        {route?.subroutes?.map((subroute) => (
                          <li
                            className={cl("nav-item")}
                            key={subroute.url + subroute.name}
                          >
                            <Link
                              className={cl(
                                "nav-link flex align-center",
                                styles.link,
                                {
                                  [styles.active]: pathname.includes(
                                    subroute.url!
                                  ),
                                }
                              )}
                              onClick={() =>
                                isMobile && dispatch(sidebarHandler(false))
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
                              <div className={styles.content}>
                                {subroute.name}
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              } else
                return (
                  <li className={cl("nav-item")} key={route.url + route.name}>
                    <Link
                      className={cl("nav-link flex align-center", styles.link, {
                        [styles.active]: pathname.includes(route.url!),
                      })}
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
                      <div className={styles.content}>
                        {route.name}
                        {!!route.count && <CountItem count={route.count} />}
                      </div>
                    </Link>
                  </li>
                );
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
