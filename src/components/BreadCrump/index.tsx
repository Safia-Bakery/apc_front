import { Link, useLocation } from "react-router-dom";
import styles from "./index.module.scss";
import { ChangeEvent, FC } from "react";
import { logoutHandler } from "reducers/auth";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { changeLanguage, langSelector, sidebarHandler } from "reducers/selects";
import useToken from "@/hooks/useToken";
import { Language } from "@/utils/keys";
import { useTranslation } from "react-i18next";

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
  "requests-inventory": "Заявки на инвентарь",
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
  "order-products-inventory": "Заявки на закуп",
  "inventory-remains": "Остатки на складах инвентарь",
  "requests-cctv": "Видеонаблюдение",
  "categories-cctv": "Категории видеонаблюдении",
  request: "Заявки",
  service_level: "Уровень сервиса",
  "statistics-inventory": "Статистика Инвентарь",
};

const Breadcrumbs: FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useAppDispatch();
  const handleLogout = () => dispatch(logoutHandler());
  const lang = useAppSelector(langSelector);

  const { data: me } = useToken({ enabled: false });

  const handleLang = (e: ChangeEvent<HTMLSelectElement>) =>
    dispatch(changeLanguage(e.target.value as Language));

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
              <Link to="/home">{t("main")}</Link>
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

        <div className="flex md:gap-4 gap-2">
          <select
            onChange={handleLang}
            value={lang}
            className="!bg-transparent"
          >
            {Object.keys(Language).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <span
            onClick={handleLogout}
            id="logout_btn"
            className={styles.logout}
          >
            {t("leave")} ({me?.username})
          </span>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;
