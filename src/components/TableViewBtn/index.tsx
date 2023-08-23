import { FC } from "react";
import styles from "./index.module.scss";

interface Props {
  onClick: () => void;
}

const TableViewBtn: FC<Props> = ({ onClick }) => {
  return (
    // <td width={40}>
    <div onClick={onClick}>
      <img className={styles.viewImg} src="/assets/icons/edit.svg" alt="edit" />
    </div>
    // </td>
  );
};

export default TableViewBtn;
