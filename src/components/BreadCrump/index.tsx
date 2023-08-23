import { Link, useLocation } from "react-router-dom";
import styles from "./index.module.scss";
import { FC } from "react";
import { logoutHandler } from "src/redux/reducers/auth";
import { useAppDispatch } from "src/redux/utils/types";
import { sidebarHandler } from "src/redux/reducers/selects";
import useToken from "src/hooks/useToken";

interface Breadcrumb {
  path: string;
  name: string;
}

const routeNameMappings: { [key: string]: string } = {
  about: "About",
  contact: "Contact",
  home: "Главная",
  requests: "Заявки",
  map: "Карта",
  statistics: "Статистика",
  categories: "Категории",
  "items-in-stock": "Остатки на складах",
  brigades: "Бригады",
  users: "Пользователи",
  roles: "Роли",
  comments: "Отзывы",
  settings: "Настройки",
  add: "Добавить",
  edit: "Изменить",
  branches: "Филлиалы",
  "requests-inventory": "Заявка на инвентарь",
  "requests-apc": "Заявки APC",
  "requests-designer": "Проектная работа для дизайнеров",
};

const Breadcrumbs: FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logoutHandler());
    window.location.reload();
  };
  const { data: me } = useToken({ enabled: false });

  const breadcrumbs: Breadcrumb[] = [];

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  pathSegments.reduce((prevPath, currentPath) => {
    const path = `${prevPath}/${currentPath}`;
    const name = location?.state?.name
      ? location.state?.name
      : routeNameMappings[currentPath] || currentPath.replace(/-/g, " ");

    breadcrumbs.push({ path, name });

    return path;
  }, "");

  return (
    <div className={styles.block}>
      <div className={styles.container}>
        <ul className={styles.breadcrump}>
          <button
            onClick={() => dispatch(sidebarHandler(true))}
            className="btn btn-danger p-2 btn-fill btn-round btn-icon"
          >
            <img
              width={22}
              className="d-flex"
              height={22}
              src="/assets/icons/burger.svg"
              alt="burger"
            />
          </button>
          <li className="ml-3">
            <Link to="/">Главная</Link>
          </li>
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path}>
              {index === breadcrumbs.length - 1 ? (
                <span>{breadcrumb.name}</span>
              ) : (
                <Link to={breadcrumb.path}>{breadcrumb.name}</Link>
              )}
            </li>
          ))}
        </ul>

        <span onClick={handleLogout} className={styles.logout}>
          Выйти ({me?.username})
        </span>
      </div>
    </div>
  );
};

export default Breadcrumbs;
