import styles from "./index.module.scss";

const ControlPanel = () => {
  return (
    <div className={styles.card}>
      <div className="header text-center">
        <h4 className="title m-0">Добро пожаловать Dadahon</h4>
        <p className={styles.category}>master</p>
      </div>
    </div>
  );
};

export default ControlPanel;
