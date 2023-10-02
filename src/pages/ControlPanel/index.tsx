import { useEffect } from "react";
import styles from "./index.module.scss";
import useToken from "src/hooks/useToken";
import { useNavigate } from "react-router-dom";

const ControlPanel = () => {
  const navigate = useNavigate();
  const { data: user } = useToken({ enabled: false });

  useEffect(() => {
    if (window.location.pathname === "/") navigate("/home");
  }, []);

  return (
    <div className={styles.card}>
      <div className="header text-center">
        <h4 className="title m-0">Добро пожаловать {user?.full_name}</h4>
        <p className={styles.category}>{user?.role?.toString()}</p>
      </div>
    </div>
  );
};

export default ControlPanel;
