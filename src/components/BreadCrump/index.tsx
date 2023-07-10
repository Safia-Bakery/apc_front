import React from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "../Container";
import styles from "./index.module.scss";

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

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const breadcrumbs: Breadcrumb[] = [];

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  pathSegments.reduce((prevPath, currentPath, index) => {
    const path = `${prevPath}/${currentPath}`;
    const name =
      routeNameMappings[currentPath] || currentPath.replace(/-/g, " ");

    breadcrumbs.push({ path, name });

    return path;
  }, "");

  return (
    <Container>
      <ul className={styles.breadcrump}>
        <li>
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
    </Container>
  );
};

export default Breadcrumbs;
