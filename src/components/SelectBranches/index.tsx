import { FC, Fragment } from "react";
import { BranchType } from "src/utils/types";
import cl from "classnames";
import styles from "./index.module.scss";

interface NestedListItemsProps {
  data: BranchType[] | undefined;
  isItemExpanded: (itemId: string) => boolean;
  handleItemClick: (itemId: string) => void;
  handleBranch: (product: BranchType) => void;
  className?: string;
}

const SelectBranches: FC<NestedListItemsProps> = ({
  className,
  data,
  isItemExpanded,
  handleItemClick,
  handleBranch: handleProduct,
}) => {
  return (
    <ul className={cl(className, "list-group")}>
      {data?.map((item) => (
        <Fragment key={item.id}>
          <li
            onClick={() =>
              !!item.fillial_department?.length
                ? handleItemClick(item.id)
                : handleProduct(item)
            }
            className={cl("list-group-item position-relative pointer")}
          >
            {item.name}
            {!!item.fillial_department?.length && (
              <img
                src="/assets/icons/arrow.svg"
                alt="arrow"
                className={cl(styles.arrow, {
                  [styles.expanded]: isItemExpanded(item.id),
                })}
              />
            )}
          </li>
          {isItemExpanded(item.id) && (
            <SelectBranches
              className="pl-4"
              data={item?.fillial_department}
              isItemExpanded={isItemExpanded}
              handleItemClick={handleItemClick}
              handleBranch={handleProduct}
            />
          )}
        </Fragment>
      ))}
    </ul>
  );
};

export default SelectBranches;
