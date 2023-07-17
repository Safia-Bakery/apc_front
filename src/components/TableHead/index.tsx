import { FC, PropsWithChildren } from "react";

import styles from "./index.module.scss";

interface Props extends PropsWithChildren {
  column: { name: string; key: any }[];
  sort: (key: any) => void;
  sortKey: any;
  sortOrder: "asc" | "desc";
}

const TableHead: FC<Props> = ({
  column,
  sort,
  sortKey,
  sortOrder,
  children,
}) => {
  return (
    <>
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
        {children && <tr>{children}</tr>}
      </thead>
    </>
  );
};

export default TableHead;
