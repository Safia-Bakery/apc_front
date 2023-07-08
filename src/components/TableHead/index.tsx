import { FC } from "react";
import { Order } from "src/utils/types";
import styles from "./index.module.scss";

interface Props {
  column: { name: string; key: any }[];
  sort: (key: any) => void;
  sortKey: any;
  sortOrder: "asc" | "desc";
}

const TableHead: FC<Props> = ({ column, sort, sortKey, sortOrder }) => {
  return (
    <thead>
      <tr>
        {column.map(({ name, key }) => {
          return (
            <th
              onClick={() => sort(key)}
              className={styles.tableHead}
              key={name}
            >
              {name}{" "}
              {sortKey === key && (
                <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHead;
