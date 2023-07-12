import React, { useState } from "react";
import SidebarItem from "./SidebarItem";
import { useAppDispatch } from "src/redux/utils/types";
import { logoutHandler } from "src/redux/reducers/authReducer";
import cl from "classnames";
import "./index.scss";

const routes = [
  {
    name: "Панель управления",
    url: "/",
    icon: "/assets/icons/controlPanel.svg",
  },
  {
    name: "Статистика",
    url: "/statistics",
    icon: "/assets/icons/statistics.svg",
  },
  {
    name: "Тепловая карта",
    url: "/map",
    icon: "/assets/icons/map.svg",
  },
  {
    name: "Заявки",
    url: "/orders",
    icon: "/assets/icons/orders.svg",
  },
  {
    name: "Категории",
    url: "/categories",
    icon: "/assets/icons/categories.svg",
  },
  {
    name: "Остатки на складах",
    url: "/items-in-stock",
    icon: "/assets/icons/remains-in-stock.svg",
  },
  {
    name: "Бригады",
    url: "/brigades",
    icon: "/assets/icons/brigades.svg",
  },
  {
    name: "Пользователи",
    url: "/users",
    icon: "/assets/icons/users.svg",
  },
  {
    name: "Роли",
    url: "/roles",
    icon: "/assets/icons/roles.svg",
  },
  {
    name: "Отзывы",
    url: "/comments",
    icon: "/assets/icons/comments.svg",
  },
  {
    name: "Настройки",
    subroutes: [
      {
        name: "Филлиалы",
        url: "/branches",
        icon: "/assets/icons/settings.svg",
      },
    ],
    icon: "/assets/icons/settings.svg",
  },
];

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const [active, $active] = useState(false);
  const handleLogout = () => dispatch(logoutHandler());
  return (
    <>
      <header className="shadow-sm header">
        {!active && (
          <div className="burgerBtn p-3" onClick={() => $active(!active)}>
            <img src="/assets/icons/burger.svg" alt="burger" />
          </div>
        )}
      </header>
      <div className="block" />
      <aside className={cl("sidebar ", { ["active"]: active })}>
        <div className="sidebar-wrapper">
          <div>
            <div className="w-100 d-flex flex-column">
              <h3 className="pointer mb-0">APC</h3>
              <p className="mb-0 descr">
                <small>Аварийно-ремонтные службы</small>
              </p>
            </div>
            <ul className="nav mt-2">
              {routes.map((route) => (
                <SidebarItem
                  key={route.name}
                  name={route.name}
                  icon={route.icon}
                  url={route.url}
                  subItems={route.subroutes}
                />
              ))}

              {/* <SidebarItem title="About" />
            <SidebarItem
              title="Services"
              subItems={["Service 1", "Service 2", "Service 3"]}
            />
            <SidebarItem title="Contact" /> */}
            </ul>
          </div>

          <div
            onClick={handleLogout}
            className="d-flex text-center justify-content-end px-3 pt-3 align-self-end font-weight-bold pointer logoutBlock"
          >
            Выйти
            <div className="logout ml-2">
              <img src="/assets/icons/logout.svg" alt="logout" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
