import { useState } from "react";
import "./index.scss";
import { useAppDispatch } from "src/redux/utils/types";
import { logoutHandler } from "src/redux/reducers/authReducer";

const superAdmins = [
  {
    name: "Панель управления",
    url: "/",
    icon: "/assets/icons/order.svg",
  },
  {
    name: "Статистика",
    url: "/statistics",
    icon: "/assets/icons/activeOrder.svg",
  },
  {
    name: "Тепловая карта",
    url: "/map",
    icon: "/assets/icons/historyOrder.svg",
  },
  {
    name: "Заявки",
    url: "/orders",
    icon: "/assets/icons/user.svg",
  },
  {
    name: "Категории",
    url: "/categories",
    icon: "/assets/icons/user.svg",
  },
  {
    name: "Остатки на складах",
    url: "/items-in-stock",
    icon: "/assets/icons/user.svg",
  },
  {
    name: "Бригады",
    url: "/brigades",
    icon: "/assets/icons/user.svg",
  },
  {
    name: "Пользователи",
    url: "/users",
    icon: "/assets/icons/user.svg",
  },
  {
    name: "Роли",
    url: "/roles",
    icon: "/assets/icons/user.svg",
  },
  {
    name: "Отзывы",
    url: "/comments",
    icon: "/assets/icons/user.svg",
  },
  {
    name: "Настройки",
    url: "/settings",
    icon: "/assets/icons/user.svg",
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
      <div className={`sidebar ${active && "active"}`}>
        <div className="sidebar-wrapper">
          <div>
            <div className="w-100 d-flex align-items-center flex-column">
              <h3 className="pointer mb-0">APC</h3>
              <p className="mb-0 descr">
                <small>Аварийно-ремонтные службы</small>
              </p>
            </div>

            <ul className="nav mt-2">
              {superAdmins.map((item) => (
                <li key={item.url}>
                  <a className="nav-link" href={item.url}>
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="sidebarIcon"
                    />
                    <p>{item.name}</p>
                  </a>
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
