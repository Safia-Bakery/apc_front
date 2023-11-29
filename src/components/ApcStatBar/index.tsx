import cl from "classnames";
import { FC } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "./index.module.scss";

const routesArr = [
  {
    name: "По категориям",
    url: "category",
  },
  {
    name: "По филиалам",
    url: "fillial",
  },
  {
    name: "По бригадам",
    url: "brigada",
  },
  {
    name: "Бригады по категориям",
    url: "brigade_categ",
  },
  {
    name: "По расходам",
    url: "consumptions",
  },
];

const ApcStatBar: FC = () => {
  const { pathname } = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="flex">
        {routesArr.map((route) => (
          <Link
            key={route.name}
            className={cl("py-2 px-3 my-2", {
              [styles.active]: pathname.includes(route.url),
            })}
            to={route.url}
          >
            {route.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default ApcStatBar;
