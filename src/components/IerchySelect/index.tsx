import React, { ChangeEvent, useCallback, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import { useState } from "react";
import useTools from "src/hooks/useTools";
import BaseInput from "../BaseInputs";
import MainInput from "../BaseInputs/MainInput";
import useDebounce from "src/hooks/useDebounce";
import cl from "classnames";
import { ToolTypes } from "src/utils/types";
import {
  useNavigateParams,
  useRemoveParams,
} from "src/hooks/useCustomNavigate";

const IearchSelect: React.FC = () => {
  // const navigate = useNavigate();
  const navigate = useNavigateParams();
  const removeParam = useRemoveParams();
  const initialLoadRef = useRef(true);
  const [query, $query] = useDebounce("");
  const [page, $page] = useState(1);

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
        if (entries[0].isIntersecting) {
          $page((prev) => prev + 1);
          refetch();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching, isLoading]
  );

  const onClose = () => removeParam(["itemModal"]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    $query(e.target.value);
    $page(1);
  };

  const handleProduct = (product: { id: number; name: string }) => {
    // removeParam(["itemModal"]);
    // setTimeout(() => {
    // onClose();
    navigate({ product: JSON.stringify(product), itemModal: false });
    // }, 700);
  };

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    const fetchData = async () => {
      await refetch();
    };

    fetchData();
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
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.drop}>
        <div className="popover-title">
          <button onClick={onClose} className="close">
            <span aria-hidden="true">&times;</span>
          </button>
          Выберите товар
        </div>
        <BaseInput>
          <MainInput onChange={handleSearch} />
        </BaseInput>
        <ul className={cl("list-group", styles.list)}>
          {items?.map((item, idx) => {
            if (items.length === idx + 1 && !query)
              return (
                <li
                  key={item.id}
                  ref={lastBookElementRef}
                  onClick={() => handleProduct(item)}
                  className={cl("list-group-item position-relative pointer")}
                >
                  {item.name}
                </li>
              );
            else
              return (
                <li
                  key={item.id}
                  onClick={() => handleProduct(item)}
                  className={cl("list-group-item position-relative pointer")}
                >
                  {item.name}
                </li>
              );
          })}
        </ul>
      </div>
    </>
  );
};

export default IearchSelect;
