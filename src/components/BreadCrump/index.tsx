import { Link, useLocation } from "react-router-dom";
import Container from "../Container";
import styles from "./index.module.scss";
import { FC } from "react";
import { logoutHandler, roleSelector } from "src/redux/reducers/authReducer";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import {
  sidebarHandler,
  toggleSidebar,
} from "src/redux/reducers/toggleReducer";

interface Breadcrumb {
  path: string;
  name: string;
}

const routeNameMappings: { [key: string]: string } = {
  about: "About",
  contact: "Contact",
  home: "Главная",
  orders: "Заказы",
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
};

const Breadcrumbs: FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logoutHandler());
    window.location.reload();
  };
  const me = useAppSelector(roleSelector);

  const breadcrumbs: Breadcrumb[] = [];

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  pathSegments.reduce((prevPath, currentPath) => {
    const path = `${prevPath}/${currentPath}`;
    const name =
      routeNameMappings[currentPath] || currentPath.replace(/-/g, " ");

    breadcrumbs.push({ path, name });

    return path;
  }, "");

  return (
    <div className={styles.block}>
      <Container>
        <div className={styles.container}>
          <ul className={styles.breadcrump}>
            {/* <button
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
            </button> */}
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
            Выйти ({me?.full_name})
          </span>
        </div>
      </Container>
    </div>
  );
};

export default Breadcrumbs;