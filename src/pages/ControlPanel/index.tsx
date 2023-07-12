import { useAppSelector } from "src/redux/utils/types";
import styles from "./index.module.scss";
import { roleSelector } from "src/redux/reducers/authReducer";

const ControlPanel = () => {
  const me = useAppSelector(roleSelector);

  return (
    <div className={styles.card}>
      <div className="header text-center">
        <h4 className="title m-0">Добро пожаловать {me?.full_name}</h4>
        <p className={styles.category}>{me?.role}</p>
      </div>
    </div>
  );
};

export default ControlPanel;
