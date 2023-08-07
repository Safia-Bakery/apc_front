import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { useState } from "react";
import useTools from "src/hooks/useTools";
import { ToolTypes, ToolsEarchType } from "src/utils/types";
import NestedListItems from "../NestedItem";
import BaseInput from "../BaseInputs";
import MainInput from "../BaseInputs/MainInput";
import useDebounce from "src/hooks/useDebounce";
import cl from "classnames";

const IearchSelect: React.FC = () => {
  const navigate = useNavigate();
  const initialLoadRef = useRef(true);
  const [search, $search] = useDebounce("");
  const { data, refetch } = useTools({
    enabled: false,
    ...(!!search && { query: search }),
  });

  const onClose = () => navigate("?add_product_modal=true");

  const handleProduct = (product: { id: number; name: string }) =>
    navigate(`?add_product_modal=true&product=${JSON.stringify(product)}`);

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }

    const fetchData = async () => {
      await refetch();
    };

    fetchData();
  }, [search]);

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
          <MainInput value={search} onChange={(e) => $search(e.target.value)} />
        </BaseInput>
        <ul className={cl("list-group", styles.list)}>
          {data?.items?.map((item) => (
            <li
              key={item.id}
              onClick={() => handleProduct(item)}
              className={cl("list-group-item position-relative pointer")}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default IearchSelect;
