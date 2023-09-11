import cl from "classnames";
import { FC } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

interface Props {
  data?: { label: string; url: string }[];
}

const routesArr = [
  {
    name: "по категориям",
    url: "category",
  },
  {
    name: "по филиалам",
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
];

const ApcStatBar: FC<Props> = ({ data }) => {
  const { pathname } = useLocation();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse navbar-nav">
          {routesArr.map((route) => (
            <Link
              key={route.name}
              className={cl("nav-item nav-link", {
                ["active"]: pathname.includes(route.url),
              })}
              to={route.url}
            >
              {route.name}
            </Link>
          ))}
        </div>
      </nav>

      <Outlet />
    </>
  );
};

export default ApcStatBar;
