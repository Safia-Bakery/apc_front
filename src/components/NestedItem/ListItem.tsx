import React from "react";
import cl from "classnames";
import styles from "./index.module.scss";
import { ToolsEarchType } from "src/utils/types";

interface ListItemProps {
  item: ToolsEarchType;
  isExpanded: (itemId: string) => boolean;
  handleItemClick: (itemId: string) => void;
  handleProduct: (product: ToolsEarchType) => void;
}

const ListItem: React.FC<ListItemProps> = ({
  item,
  isExpanded,
  handleItemClick,
  handleProduct,
}) => {
  return (
    <li
      onClick={() =>
        !!item.child?.length ? handleItemClick(item.id) : handleProduct(item)
      }
      className={cl("list-group-item position-relative pointer")}
    >
      {item.name}
      {!!item.child?.length && (
        <img
          src="/assets/icons/arrow.svg"
          alt="arrow"
          className={cl(styles.arrow, {
            [styles.expanded]: isExpanded(item.id),
          })}
        />
      )}
    </li>
  );
};

export default ListItem;
