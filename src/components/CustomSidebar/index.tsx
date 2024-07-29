import { FC, Fragment, useState, useTransition } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import cl from "classnames";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  MenuItemStyles,
} from "react-pro-sidebar";
import { useTranslation } from "react-i18next";
import CountItem from "./CountItem";
import { sidebatItemsSelector } from "@/store/reducers/sidebar";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import styles from "./index.module.scss";
import { sidebarHandler, toggleSidebar } from "@/store/reducers/selects";
import { MainPermissions } from "@/utils/types";
import "./index.scss";

export const Playground: FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const routes = useAppSelector(sidebatItemsSelector);
  const collapsed = useAppSelector(toggleSidebar);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const [menuItem, $menuItem] = useState<MainPermissions>();

  const toggleSubItems = (item: MainPermissions) => {
    if (item === menuItem) $menuItem(undefined);
    else startTransition(() => $menuItem(item));
  };

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: "13px",
      fontWeight: 400,
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  const handleSidebar = () => dispatch(sidebarHandler(!collapsed));

  return (
    <>
      {collapsed && <div className={styles.overlay} onClick={handleSidebar} />}
      <Sidebar
        // collapsed={collapsed}
        className={cl(styles.sidebar, { [styles.collapsed]: collapsed })}
        toggled={collapsed}
        onBackdropClick={handleSidebar}
        image="https://user-images.githubusercontent.com/25878302/144499035-2911184c-76d3-4611-86e7-bc4e8ff84ff5.jpg"
        rtl={false}
        breakPoint="md"
        backgroundColor={"rgba(68, 125, 247, 0.8)"}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className={styles.logo}>
              <h3 className={styles.title}>Service</h3>
              <div className={styles.subTitle}>
                АРС / Inventory / IT / Marketing
              </div>
            </div>
            <Menu menuItemStyles={menuItemStyles}>
              <MenuItem
                className={cl(styles.content)}
                active={pathname === "/home"}
                onClick={() => navigate("/home")}
                icon={
                  <img
                    className={styles.routeIcon}
                    height={30}
                    width={30}
                    src={"/assets/icons/controlPanel.svg"}
                  />
                }
              >
                {t("control_panel")}
              </MenuItem>
              {routes &&
                routes.map((route) => (
                  <Fragment key={route.url + route.name}>
                    {!!route.subroutes ? (
                      <SubMenu
                        open={route.screen === menuItem}
                        onClick={() => toggleSubItems(route.screen)}
                        label={t(route.name)}
                        className={`${styles.content} ${styles.submenu}`}
                        icon={
                          <img
                            className={styles.routeIcon}
                            height={30}
                            width={30}
                            src={route.icon || ""}
                          />
                        }
                        suffix={<CountItem count={route.count} />}
                      >
                        {route?.subroutes?.map((subroute) => (
                          <MenuItem
                            onClick={() =>
                              navigate(
                                `${subroute.url}${
                                  !!subroute?.param ? subroute?.param : ""
                                }`
                              )
                            }
                            icon={
                              <img
                                className={styles.routeIcon}
                                height={30}
                                width={30}
                                src={subroute.icon || ""}
                              />
                            }
                            active={pathname.includes(subroute.url!)}
                            className={styles.content}
                            key={subroute.url}
                          >
                            {t(subroute.name)}
                          </MenuItem>
                        ))}
                      </SubMenu>
                    ) : (
                      <MenuItem
                        className={cl(styles.content)}
                        active={pathname.includes(route.url!)}
                        onClick={() =>
                          navigate(
                            `${route.url}${!!route?.param ? route?.param : ""}`
                          )
                        }
                        icon={
                          <img
                            className={styles.routeIcon}
                            height={30}
                            width={30}
                            src={route.icon || ""}
                          />
                        }
                        suffix={<CountItem count={route.count} />}
                      >
                        {t(route.name)}
                      </MenuItem>
                    )}
                  </Fragment>
                ))}
            </Menu>
          </div>
        </div>
      </Sidebar>
    </>
  );
};
