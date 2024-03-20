import styles from "./index.module.scss";

type Props = {
  count?: number;
};

const CountItem = ({ count }: Props) => {
  return (
    count && (
      <div className="relative mr-2">
        <img height={30} width={30} src={"/assets/icons/bell.svg"} />
        <div className={styles.counter}>{count > 99 ? 99 : count}</div>
      </div>
    )
  );
};

export default CountItem;
