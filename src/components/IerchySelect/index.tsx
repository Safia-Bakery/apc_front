import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import { useState } from "react";
import useToolsIearchs from "src/hooks/useToolsIearchs";
import { ToolsEarchType } from "src/utils/types";
import NestedListItems from "../NestedItem";

const IearchSelect: React.FC = () => {
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const { data } = useToolsIearchs({
    enabled: false,
  });

  const onClose = () => navigate("?add_product_modal=true");

  const handleItemClick = (itemId: string) => {
    if (expandedItems.includes(itemId)) {
      setExpandedItems(expandedItems.filter((id) => id !== itemId));
    } else {
      setExpandedItems([...expandedItems, itemId]);
    }
  };

  const handleProduct = (product: ToolsEarchType) =>
    navigate(`?add_product_modal=true&product=${JSON.stringify(product)}`);

  const isItemExpanded = (itemId: string) => expandedItems.includes(itemId);

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
        <div className="bs-searchbox">
          <input
            type="text"
            className="form-control"
            role="textbox"
            aria-label="Search"
          />
        </div>
        <NestedListItems
          className={"pl-0"}
          data={data}
          isItemExpanded={isItemExpanded}
          handleItemClick={handleItemClick}
          handleProduct={handleProduct}
        />
      </div>
    </>
  );
};

export default IearchSelect;
