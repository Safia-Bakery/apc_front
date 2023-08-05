import { FC, Fragment } from "react";
import ListItem from "./ListItem";
import { ToolsEarchType } from "src/utils/types";
import cl from "classnames";

interface NestedListItemsProps {
  data: ToolsEarchType[] | undefined;
  isItemExpanded: (itemId: string) => boolean;
  handleItemClick: (itemId: string) => void;
  handleProduct: (product: ToolsEarchType) => void;
  className?: string;
}

const NestedListItems: FC<NestedListItemsProps> = ({
  data,
  isItemExpanded,
  handleItemClick,
  handleProduct,
  className,
}) => {
  return (
    <ul className={cl(className, "list-group")}>
      {data?.map((item) => (
        <Fragment key={item.id}>
          <ListItem
            item={item}
            isExpanded={isItemExpanded}
            handleItemClick={handleItemClick}
            handleProduct={handleProduct}
          />
          {isItemExpanded(item.id) && (
            <NestedListItems
              className="pl-4"
              data={item.child}
              isItemExpanded={isItemExpanded}
              handleItemClick={handleItemClick}
              handleProduct={handleProduct}
            />
          )}
        </Fragment>
      ))}
    </ul>
  );
};

export default NestedListItems;
