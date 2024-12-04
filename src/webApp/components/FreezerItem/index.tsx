import {
  addItem,
  cartSelector,
  deleteItem,
} from "@/store/reducers/webInventory";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { CheckOutlined, SettingOutlined } from "@ant-design/icons";
import { CSSProperties, useState } from "react";
import FreezerItemModal from "./modal";

type Props = {
  style?: CSSProperties;
  add_limit?: boolean;
  tool: {
    image?: string;
    name?: string;
    id: string | number;
    count: number;
    parent_id?: string;
  };
};

const FreezerItem = ({ style, tool, add_limit }: Props) => {
  const dispatch = useAppDispatch();
  const [tool_id, $tool_id] = useState<number>();
  const cart = useAppSelector(cartSelector);
  const closeModal = () => $tool_id(undefined);

  return (
    <div
      style={style}
      className="rounded-3xl flex gap-5 w-full bg-white h-18 overflow-hidden"
    >
      <div className="flex flex-1 justify-between pt-3 flex-col">
        <div className="flex flex-1 justify-center ml-4 flex-col">
          <h5 className="font-bold text-base">{tool?.name}</h5>

          <p className="text-gray-500 text-xs">Кол-во: {tool.count || 0}</p>
        </div>

        {add_limit ? (
          <div
            onClick={() => $tool_id(+tool.id)}
            className="overflow-hidden flex items-center justify-center rounded-tl-2xl rounded-br-3xl w-20 h-9 self-end !border !border-tgPrimary"
          >
            <SettingOutlined />
          </div>
        ) : (
          <div className="overflow-hidden flex items-center justify-center rounded-tl-2xl rounded-br-3xl w-20 h-9 self-end !border !border-tgPrimary">
            {!cart[tool.id] ? (
              <button
                className="flex flex-1 justify-center bg-white bg-transparent items-center !border !border-tgPrimary h-full"
                onClick={() => dispatch(addItem(tool))}
              >
                <CheckOutlined />
              </button>
            ) : (
              <button
                onClick={() => dispatch(deleteItem(tool?.id?.toString()))}
                className="flex justify-evenly flex-1 bg-tgPrimary h-full items-center"
              >
                <CheckOutlined className="text-white" />
              </button>
            )}
          </div>
        )}
      </div>

      {add_limit && (
        <FreezerItemModal
          tool_id={tool_id}
          closeModal={closeModal}
          tool_name={tool.name}
          tool_count={tool.count}
          tool_parent={tool.parent_id}
        />
      )}
    </div>
  );
};

export default FreezerItem;
