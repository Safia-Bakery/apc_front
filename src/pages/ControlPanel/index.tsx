import styles from "./index.module.scss";
import useToken from "@/hooks/useToken";

const ControlPanel = () => {
  const { data: user } = useToken({ enabled: false });
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
