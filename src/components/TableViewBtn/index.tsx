import { FC } from "react";

interface Props {
  onClick: () => void;
}

const TableViewBtn: FC<Props> = ({ onClick }) => {
  return (
    <div onClick={onClick} id="edit_item">
      <img
        className={"h-4 w-4 cursor-pointer"}
        src="/assets/icons/edit.svg"
        alt="edit"
      />
    </div>
  );
};

export default TableViewBtn;
