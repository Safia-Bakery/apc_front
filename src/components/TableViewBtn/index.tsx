import { FC } from "react";
import styles from "./index.module.scss";

interface Props {
  onClick: () => void;
}

const TableViewBtn: FC<Props> = ({ onClick }) => {
  return (
    <div onClick={onClick} id="edit_item">
      <img className={styles.viewImg} src="/assets/icons/edit.svg" alt="edit" />
    </div>
  );
};

export default TableViewBtn;
