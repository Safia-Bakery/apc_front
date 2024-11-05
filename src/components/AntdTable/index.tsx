import { Table } from "antd";
import styles from "./index.module.scss";
import { TableProps } from "antd/es/table";
import cl from "classnames";
import { ReactNode, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useQueryString from "@/hooks/custom/useQueryString";
import { itemsPerPage } from "@/utils/helpers";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import { useLocation } from "react-router-dom";
import CustomNavigator from "./navigator";

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
  const { search } = useLocation();
  const currentPage = Number(useQueryString("page")) || 1;
  const navigateParams = useNavigateParams();
  const handleRowStyles = (item: T) =>
    typeof rowClassName === "function" ? rowClassName?.(item) : rowClassName;

  const handleNavigate = useCallback(
    (page: number) => {
      navigateParams({ page });
    },
    [currentPage, search]
  );

  const indexOfLastItem = Math.min(currentPage * itemsPerPage);
  const indexOfFirstItem = useMemo(() => {
    return (
      totalItems && Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)
    );
  }, [currentPage, totalItems]);

  return (
    <div className={cl(styles.container_wrapper)}>
      {!!data.length && <CustomNavigator data={data} />}
      <Table
        {...(others as any)}
        rootClassName="overflow-visible"
        dataSource={data?.map((item, idx) => ({ ...item, key: idx }))}
        className={`common-table ${styles.table} align-center ${className}`}
        rowClassName={(item) => `clickable-row ${handleRowStyles(item)}`}
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
        // virtual
        columns={columns}
        title={() =>
          !!totalItems && (
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
