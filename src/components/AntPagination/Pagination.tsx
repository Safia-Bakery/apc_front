import { ReactElement, useCallback } from "react";
import { Pagination as AntdPagination } from "antd";
import styles from "./Pagination.module.scss";
import { useNavigateParams } from "@/hooks/custom/useCustomNavigate";
import useQueryString from "@/hooks/custom/useQueryString";

function Pagination({ totalPages = 0 }: { totalPages?: number }): ReactElement {
  const navigate = useNavigateParams();
  const offsetStr = Number(useQueryString("offset") || 0);
  const offset = offsetStr / 20 + 1;

  const onChangeoffset = useCallback(
    (page: any) => {
      navigate({ offset: (page - 1) * 20 });
    },
    [navigate]
  );

  return totalPages > 1 ? (
    <div className={styles.pagination}>
      <AntdPagination
        pageSize={20}
        showTitle={false}
        current={offset ? offset : 1}
        onChange={onChangeoffset}
        showSizeChanger={false}
        total={totalPages * 20}
      />
    </div>
  ) : (
    <div />
  );
}

export default Pagination;
