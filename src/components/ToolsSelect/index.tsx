import React, { ChangeEvent, useCallback, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { useState } from "react";
import useTools from "src/hooks/useTools";
import BaseInput from "../BaseInputs";
import MainInput from "../BaseInputs/MainInput";
import useDebounce from "src/hooks/custom/useDebounce";
import cl from "classnames";
import { ToolTypes } from "src/utils/types";
import {
  useNavigateParams,
  useRemoveParams,
} from "src/hooks/custom/useCustomNavigate";
import useQueryString from "src/hooks/custom/useQueryString";
import useUpdateEffect from "src/hooks/useUpdateEffect";

const ToolsSelect: React.FC = () => {
  const navigate = useNavigateParams();
  const removeParam = useRemoveParams();
  const [query, $query] = useDebounce("");
  const [search, $search] = useState("");
  const [page, $page] = useState(1);
  const [focused, $focused] = useState(false);

  const productJson = useQueryString("product");
  const product = productJson && JSON.parse(productJson);

  const { data, refetch, isFetching, isLoading } = useTools({
    page,
    enabled: false,
    ...(!!query && { query }),
  });
  const [items, $items] = useState<ToolTypes["items"]>([]);
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
    removeParam(["itemModal"]);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    $query(e.target.value);
    $search(e.target.value);
    $page(1);
  };

  const close = () => {
    removeParam(["itemModal"]);
    $search("");
    $focused(false);
  };

  useEffect(() => {
    if (product?.name) {
      $search(product.name);
    }
  }, [product?.name]);

  const handleProduct = (product: { id: number; name: string }) => {
    navigate({ product: JSON.stringify(product), itemModal: false });
    $focused(false);
  };

  const handleFocus = () => {
    // if (!enabled) refetch();
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
        <BaseInput className="mb-0 relative">
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
            onFocus={handleFocus}
            onChange={handleSearch}
            value={search}
          />
        </BaseInput>
        {focused && (
          <ul className={cl("list-group border border-gray-500", styles.list)}>
            {items?.map((item, idx) => {
              if (items.length === idx + 1 && !query)
                return (
                  <li
                    key={item.id}
                    ref={lastBookElementRef}
                    onClick={() => handleProduct(item)}
                    className={cl(
                      "py-2 px-4 relative pointer hover:bg-hoverGray transition-colors border-b border-b-gray-500"
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
                      "py-2 px-4 relative pointer hover:bg-hoverGray transition-colors border-b border-b-gray-500"
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

export default ToolsSelect;
