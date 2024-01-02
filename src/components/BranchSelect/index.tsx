import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  KeyboardEvent,
} from "react";
import styles from "./index.module.scss";
import { useState } from "react";
import BaseInput from "../BaseInputs";
import MainInput from "../BaseInputs/MainInput";
import useDebounce from "custom/useDebounce";
import cl from "classnames";
import { BranchTypes } from "@/utils/types";
import { useNavigateParams, useRemoveParams } from "custom/useCustomNavigate";
import useBranches from "@/hooks/useBranches";
import useQueryString from "custom/useQueryString";
import useUpdateEffect from "custom/useUpdateEffect";

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
  const [selectedIdx, $selectedIdx] = useState(-1);

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
    $selectedIdx(-1);
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
    $selectedIdx(-1);
  };

  useEffect(() => {
    if (branch?.name) {
      $search(branch.name);
    }
  }, [branch?.name]);

  const handleProduct = (product: { id: string; name: string }) => {
    navigate({ branch: JSON.stringify(product), choose_fillial: false });
    $focused(false);
    $selectedIdx(-1);
  };

  const handleFocus = () => {
    if (!enabled) refetch();
    $focused(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      $selectedIdx((prevIndex) =>
        prevIndex < items.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (event.key === "ArrowUp") {
      $selectedIdx((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (event.key === "Enter") {
      if (selectedIdx !== -1) {
        event.preventDefault();
        handleProduct(items[selectedIdx]);
      }
    }
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

  useEffect(() => {
    if (selectedIdx !== -1) {
      const selectedOptionElement = document.getElementById(
        `option-${selectedIdx}`
      );
      if (selectedOptionElement) {
        selectedOptionElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIdx]);

  if (isLoading && !items.length && enabled) return;

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
            onKeyDown={handleKeyDown}
          />
        </BaseInput>
        {focused && (
          <ul className={cl(styles.lists, "shadow-xl")}>
            {items?.map((item, idx) => {
              if (items.length === idx + 1 && !query)
                return (
                  <li
                    key={item.id}
                    ref={lastBookElementRef}
                    onClick={() =>
                      handleProduct({ id: item.id, name: item.name })
                    }
                    id={`option-${idx}`}
                    className={cl(styles.list, {
                      ["bg-gray-400"]: idx === selectedIdx,
                    })}
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
                    id={`option-${idx}`}
                    className={cl(styles.list, {
                      ["bg-gray-400"]: idx === selectedIdx,
                    })}
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
