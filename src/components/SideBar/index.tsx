import { useState } from "react";
import "./index.scss";
import { useAppDispatch } from "src/redux/utils/types";
import { logoutHandler } from "src/redux/reducers/authReducer";
import { Link } from "react-router-dom";

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
    url: "/settings",
    icon: "/assets/icons/settings.svg",
  },
];

const SideBar = () => {
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
      <div className={`sidebar ${active && "active"} sidebar-wrapper`}>
        <div className="sidebar-wrapper">
          <div>
            <div className="w-100 d-flex flex-column">
              <h3 className="pointer mb-0">APC</h3>
              <p className="mb-0 descr">
                <small>Аварийно-ремонтные службы</small>
              </p>
            </div>

            <ul className="nav mt-2">
              {routes.map((item) => (
                <li key={item.url}>
                  <Link to={`${item.url}`} className="nav-link">
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="sidebarIcon"
                    />
                    <p>{item.name}</p>
                  </Link>
                </li>
              ))}
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
      </div>
      {active && <div className="overlay" onClick={() => $active(!active)} />}
    </>
  );
};

export default SideBar;
