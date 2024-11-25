import { baseURL } from "@/store/baseUrl";
import {
  addItem,
  cartSelector,
  deleteItem,
} from "@/store/reducers/webInventory";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { Image } from "antd";
import { CheckOutlined } from "@ant-design/icons";

import { CSSProperties } from "react";

type Props = {
  style?: CSSProperties;
  tool: {
    image?: string;
    name?: string;
    id: string | number;
    count: number;
  };
};

const FreezerItem = ({ style, tool }: Props) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(cartSelector);

  return (
    <div
      style={style}
      className="rounded-3xl flex gap-5 w-full bg-white h-18 overflow-hidden"
    >
      <div className="flex flex-1 justify-between pt-3 flex-col">
        <div className="flex flex-1 justify-center flex-col ml-4">
          <h5 className="font-bold text-base">{tool?.name}</h5>
          <h5 className="font-bold text-base mt-2 text-gray-500">
            Кол-во: x{tool.count || 0}
          </h5>
        </div>

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
      </div>
    </div>
  );
};

export default FreezerItem;
