import styles from "./index.module.scss";
import Table, { TableProps } from "antd/es/table";
import cl from "classnames";
import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useQueryString from "@/hooks/custom/useQueryString";
import { itemsPerPage } from "@/utils/helpers";
import Pagination from "../Pagination";

type ReturnFunction<Tval> = (smt: Tval) => string;
type RowClassName<T> = string | ReturnFunction<T>;

interface Props<TData> extends TableProps<TData> {
  data?: TData[];
  className?: string;
  rowClassName?: RowClassName<TData>;
  isLoading?: boolean;
  totalItems?: number;
  children?: ReactNode;
}

function AntdTable<T>({
  data = [],
  columns,
  className,
  rowClassName,
  isLoading,
  totalItems,
  ...others
}: Props<T>) {
  const { t } = useTranslation();
  const currentPage = Number(useQueryString("page")) || 1;
  const handleRowStyles = (item: T) =>
    typeof rowClassName === "function" ? rowClassName?.(item) : rowClassName;

  const indexOfLastItem = Math.min(currentPage * itemsPerPage);
  const indexOfFirstItem = useMemo(() => {
    return (
      totalItems && Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)
    );
  }, [currentPage, totalItems]);

  return (
    <div className={cl(styles.container_wrapper)}>
      <Table
        {...(others as any)}
        rootClassName="overflow-visible"
        dataSource={data?.map((item, idx) => ({ ...item, key: idx }))}
        className={`common-table ${styles.table} align-center ${className}`}
        rowClassName={(item) => `clickable-row ${handleRowStyles(item)}`}
        footer={false}
        pagination={false}
        // virtual
        columns={columns}
        title={() =>
          !!totalItems && (
            <div>
              {t("shown_items")}{" "}
              <b>
                {indexOfFirstItem}-
                {totalItems < itemsPerPage
                  ? totalItems || 0
                  : indexOfLastItem || 0}
              </b>{" "}
              {t("from")} <b>{totalItems}</b>.
            </div>
          )
        }
      />

      {!!totalItems && (
        <Pagination totalPages={Math.ceil(totalItems / itemsPerPage)} />
      )}
    </div>
  );
}

export default AntdTable;
