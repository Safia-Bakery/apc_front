import { Table } from "antd";
import styles from "./index.module.scss";
import { TableProps } from "antd/es/table";
import cl from "classnames";
import { ReactNode, useCallback, useMemo } from "react";
import ItemsCount from "../ItemsCount";
import { useTranslation } from "react-i18next";
import useQueryString from "@/hooks/custom/useQueryString";
import { itemsPerPage } from "@/utils/helpers";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";

type ReturnFunction<Tval> = (smt: Tval) => string;
type RowClassName<T> = string | ReturnFunction<T>;

interface Props<TData> extends TableProps<TData> {
  data?: TData[];
  // columns: ColumnGroupType<TData> | ColumnType<TData>[];
  className?: string;
  // children?: ReactNode;
  rowClassName?: RowClassName<TData>;
  isLoading?: boolean;
  totalItems?: number;
  children?: ReactNode;
}

function AntdTable<T>({
  data,
  columns,
  className,
  rowClassName,
  isLoading,
  totalItems,
  ...others
}: Props<T>) {
  const { t } = useTranslation();
  const currentPage = Number(useQueryString("page")) || 1;
  const navigateParams = useNavigateParams();
  const handleRowStyles = (item: T) =>
    typeof rowClassName === "function" ? rowClassName?.(item) : rowClassName;

  const handleNavigate = useCallback(
    (page: number) => {
      navigateParams({ page });
    },
    [currentPage]
  );

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
        scroll={{ y: 400 }}
        dataSource={data?.map((item, idx) => ({ ...item, key: idx }))}
        className={`common-table ${styles.table} align-center ${className}`}
        rowClassName={`clickable-row ${handleRowStyles}`}
        footer={false}
        pagination={
          totalItems
            ? {
                total: totalItems,
                hideOnSinglePage: false,
                current: currentPage,
                pageSize: itemsPerPage,
                onChange: handleNavigate,
                showSizeChanger: false,
                position: ["bottomLeft"],
              }
            : false
        }
        virtual
        columns={columns}
        title={() =>
          totalItems && (
            <div>
              {t("shown_items")}{" "}
              <b>
                {indexOfFirstItem}-{indexOfLastItem === 0 ? 0 : indexOfLastItem}
              </b>{" "}
              {t("from")} <b>{totalItems}</b>.
            </div>
          )
        }
      />
    </div>
  );
}

export default AntdTable;