import { Link, useLocation } from "react-router-dom";
import styles from "./index.module.scss";
import { FC } from "react";
import { logoutHandler } from "reducers/auth";
import { useAppDispatch } from "@/store/utils/types";
import { sidebarHandler } from "reducers/selects";
import useToken from "@/hooks/useToken";

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
  "requests-apc": "Заявки АРС",
  "requests-it": "Заявки IT",
  "requests-designer": "Проектная работа для дизайнеров",
  "requests-apc-retail": "Заявки на APC розница",
  "requests-apc-fabric": "Заявки на APC фабрика",
  "marketing-local_marketing": "Локальный маркетинг",
  "marketing-promo_production": "Промо-продукция",
  "marketing-pos": "POS-Материалы",
  "marketing-complects": "Комплекты",
  "marketing-designers": "Проектная работа для дизайнеров",
  "marketing-branchEnv": "Внешний вид филиала",
  "marketing-unstandartAdv": "Для Тер.Менеджеров",
  "categories-it": "Категории IT",
  "add-product": "Добавить Продукты",
  "edit-product": "Изменить Продукты",
  "requests-logystics": "Заявки на Запрос машин",
  clients: "Клиенты",
  logs: "Логи",
  products: "Продукты",
  "client-comments": "Отзывы гостей",
  "products-inventory": "Остатки на складах",
  "products-ierarch": "Инвентарь / Товары",
  "hr-objections": "Возражении 📝",
  "hr-offers": "Предложении 🧠",
  faq: "Вопросы и ответы",
  "hr-asked-questions": "Заданные вопросы ❔",
};

const Breadcrumbs: FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useAppDispatch();
  const handleLogout = () => dispatch(logoutHandler());

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
            className="btn btn-primary p-2 btn-fill btn-round btn-icon mr-3"
          >
            <img
              width={22}
              className="flex"
              height={22}
              src="/assets/icons/burger.svg"
              alt="burger"
            />
          </button>
          {window.location.pathname !== "/home" && (
            <li>
              <Link to="/home">Главная</Link>
            </li>
          )}
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.path}>
              {index === breadcrumbs.length - 1 ? (
                <span>{breadcrumb.name}</span>
              ) : (
                <Link to={breadcrumb.path + location.search}>
                  {breadcrumb.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <span onClick={handleLogout} id="logout_btn" className={styles.logout}>
          Выйти ({me?.username})
        </span>
      </div>
    </div>
  );
};

export default Breadcrumbs;
