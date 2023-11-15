import styles from "./index.module.scss";

const Loading = () => {
  return (
    <div className={styles.wrap}>
      <div className="spinner-border text-link" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
