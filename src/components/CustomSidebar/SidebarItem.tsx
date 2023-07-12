import { FC, useState } from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";

interface SidebarItemProps {
  name: string;
  icon: string;
  url?: string;
  subItems?: { name: string; icon: string; url?: string }[];
}

const SidebarItem: FC<SidebarItemProps> = ({ name, subItems, icon, url }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubMenu = () => {
    if (url) navigate(url);
    else setIsOpen(!isOpen);
  };

  const handleNavigate = (route?: string) => () => {
    if (route) navigate(route);
  };

  return (
    <li className="nav-link d-flex flex-column align-items-start pointer">
      <div
        onClick={toggleSubMenu}
        className="d-flex align-items-center justify-content-center"
      >
        <img src={icon} alt={name} className="sidebarIcon" />
        <p className="mb-0"> {name}</p>
        {subItems && <span>{isOpen ? "-" : "+"}</span>}
      </div>
      {isOpen && subItems?.length && (
        <ul>
          {subItems.map((item, index) => (
            <li key={index} className="pointer">
              <div
                onClick={handleNavigate(item.url)}
                className="d-flex align-items-center justify-content-center"
              >
                <img src={icon} alt={item.name} className="sidebarIcon" />
                <p className="mb-0">{item.name}</p>
                {subItems && <span>{isOpen ? "-" : "+"}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarItem;
