import { ChangeEvent, FC, useCallback, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { useState } from "react";
import BaseInput from "../BaseInputs";
import MainInput from "../BaseInputs/MainInput";
import useDebounce from "src/hooks/custom/useDebounce";
import cl from "classnames";
import { BranchTypes } from "src/utils/types";
import {
  useNavigateParams,
  useRemoveParams,
} from "src/hooks/custom/useCustomNavigate";
import useBranches from "src/hooks/useBranches";
import useQueryString from "src/hooks/custom/useQueryString";
import useUpdateEffect from "src/hooks/useUpdateEffect";

interface Props {
  origin?: number;
  enabled?: boolean;
}

const BranchSelect: FC<Props> = ({ origin = 0, enabled }) => {
  const navigate = useNavigateParams();
  const removeParam = useRemoveParams();
  const [query, $query] = useDebounce("");
  const [search, $search] = useState("");
  const [page, $page] = useState(1);
  const [focused, $focused] = useState(false);

  const branchJson = useQueryString("branch");
  const branch = branchJson && JSON.parse(branchJson);

  const { data, refetch, isFetching, isLoading } = useBranches({
    origin,
    page,
    enabled,
    ...(!!query && { body: { name: query } }),
  });
  const [items, $items] = useState<BranchTypes["items"]>([]);
  const observer: any = useRef();
  const lastBookElementRef = useCallback(
    (node: any) => {
      if (isFetching || isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && data?.pages && data?.pages >= page) {
          $page((prev) => prev + 1);
          refetch();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, isLoading]
  );

  const onClose = () => {
    $focused(false);
    removeParam(["choose_fillial"]);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    $query(e.target.value);
    $search(e.target.value);
    $page(1);
  };

  const close = () => {
    removeParam(["branch", "choose_fillial"]);
    $search("");
    $focused(false);
  };

  useEffect(() => {
    if (branch?.name) {
      $search(branch.name);
    }
  }, [branch?.name]);

  const handleProduct = (product: { id: string; name: string }) => {
    navigate({ branch: JSON.stringify(product), choose_fillial: false });
    $focused(false);
  };

  const handleFocus = () => {
    if (!enabled) refetch();
    $focused(true);
  };

  useUpdateEffect(() => {
    refetch();
  }, [query]);

  useEffect(() => {
    if (data?.items.length) {
      $items((prev) => [...prev, ...data?.items]);
    }
    if (!!query && data?.items) {
      $items(data?.items);
    }
  }, [data?.items]);

  return (
    <>
      {focused && <div className={styles.overlay} onClick={onClose} />}
      <div className={styles.drop}>
        <BaseInput className="!mb-0 relative">
          {focused && (
            <img
              onClick={close}
              src="/assets/icons/clear.svg"
              alt="clear"
              width={15}
              height={15}
              className={styles.close}
            />
          )}
          <MainInput
            onChange={handleSearch}
            value={search}
            onFocus={handleFocus}
          />
        </BaseInput>
        {focused && (
          <ul className={cl(styles.list, "shadow-xl")}>
            {items?.map((item, idx) => {
              if (items.length === idx + 1 && !query)
                return (
                  <li
                    key={item.id}
                    ref={lastBookElementRef}
                    onClick={() =>
                      handleProduct({ id: item.id, name: item.name })
                    }
                    className={cl(
                      "py-2 px-4 relative pointer hover:bg-hoverGray transition-colors border-b border-b-black "
                    )}
                  >
                    {item.name}
                  </li>
                );
              else
                return (
                  <li
                    key={item.id}
                    onClick={() =>
                      handleProduct({ id: item.id, name: item.name })
                    }
                    className={cl(
                      "py-2 px-4 relative pointer hover:bg-hoverGray transition-colors border-b border-b-black"
                    )}
                  >
                    {item.name}
                  </li>
                );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default BranchSelect;
