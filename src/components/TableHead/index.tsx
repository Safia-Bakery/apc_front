import { FC, PropsWithChildren, useCallback, useState } from "react";
import useUpdateEffect from "@/hooks/useUpdateEffect";

interface Props extends PropsWithChildren {
  column: { name: string; key: any }[];
  data?: any[];
  onSort?: (arg: any[] | undefined) => void;
}

const TableHead: FC<Props> = ({ column, children, data, onSort }) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortKey, setSortKey] = useState();
  const handleSort = (key: any) => () => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortData = useCallback(() => {
    if (data && sortKey) {
      const sortedData = [...data].sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
        else return 0;
      });
      return onSort?.(sortedData);
    }
  }, [sortKey, sortOrder]);

  useUpdateEffect(() => {
    sortData();
  }, [sortKey, sortOrder]);

  return (
    <>
      <thead>
        <tr>
          {column.map(({ name, key }) => (
            <th
              onClick={handleSort(key)}
              className={"bg-primary text-white"}
              key={name}
            >
              {name}{" "}
              {sortKey === key && (
                <span>{sortOrder === "asc" ? "▲" : "▼"}</span>
              )}
            </th>
          ))}
        </tr>
        {children && <tr>{children}</tr>}
      </thead>
    </>
  );
};

export default TableHead;
