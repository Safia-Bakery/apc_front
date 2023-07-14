import { FC, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./index.scss";
import cl from "classnames";

interface SidebarItemProps {
  name: string;
  icon: string;
  url?: string;
  subItems?: { name: string; icon: string; url?: string }[];
}

const SidebarItem: FC<SidebarItemProps> = ({ name, subItems, icon, url }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [submenu, $submenu] = useState(false);

  const activeRoute = (route: string | undefined) => {
    if (route && pathname.includes(route)) return true;
    return false;
  };

  const toggleSubMenu = () => {
    if (url) navigate(url);
    else $submenu(!submenu);
  };

  const handleNavigate = (route?: string) => () => {
    if (route) navigate(route);
  };

  return (
    <li
      onClick={toggleSubMenu}
      className={cl("nav-link navLink", {
        ["activeRoute"]: activeRoute(url),
        ["noPadding"]: submenu && subItems?.length,
      })}
    >
      <div
        className={cl("d-flex align-items-center ", {
          ["nav-link w-100"]: submenu && subItems?.length,
        })}
      >
        <img src={icon} alt={name} className="sidebarIcon" />
        <p className="mb-0">{name}</p>
        {subItems && <span>{submenu ? "-" : "+"}</span>}
      </div>
      {submenu && subItems?.length && (
        <ul className={cl("submenu nav-link")}>
          {subItems.map((item, index) => (
            <li
              key={index}
              onClick={handleNavigate(item.url)}
              className={cl("pointer nav-link navLinksub", {
                ["activeRoute"]: activeRoute(item.url),
              })}
            >
              <div className="d-flex align-items-center ">
                <img src={icon} alt={item.name} className="sidebarIcon" />
                <p className="mb-0">{item.name}</p>
                {subItems && <span>{submenu ? "-" : "+"}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarItem;
