import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MainPermissions } from "src/utils/types";
import { useAppDispatch, useAppSelector } from "src/store/utils/types";
import { sidebarHandler, toggleSidebar } from "src/store/reducers/selects";
import { logoutHandler } from "src/store/reducers/auth";
import useToken from "src/hooks/useToken";
import { sidebatItemsSelector } from "src/store/reducers/sidebar";
import cl from "classnames";
import { isMobile } from "src/utils/helpers";
import styles from "./index.module.scss";

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
            <p className={styles.subTitle}>АРС / Inventory / IT / Marketing</p>
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
                <p className={styles.content}>Панель управления</p>
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
                              <p className={styles.content}>{subroute.name}</p>
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
                      <p className={styles.content}>{route.name}</p>
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
