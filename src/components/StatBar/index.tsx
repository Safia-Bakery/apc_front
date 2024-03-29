import cl from "classnames";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

interface Props {
  arr: { name: string; url: string }[];
}

const StatBar: FC<Props> = ({ arr }) => {
  const { t } = useTranslation();
  const { pathname, search } = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="flex">
        {arr.map((route) => (
          <Link
            key={route.name + route.url}
            className={cl("py-2 px-3 my-2", {
              ["border-b border-b-black font-bold text-black"]:
                pathname.includes(route.url),
            })}
            to={route.url + search}
          >
            {t(route.name)}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default StatBar;
