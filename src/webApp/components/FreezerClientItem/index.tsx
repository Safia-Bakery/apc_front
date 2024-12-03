import { getFreezerBalances } from "@/hooks/freezer";
import {
  addItem,
  cartSelector,
  decrementSelected,
  incrementSelected,
} from "@/store/reducers/webInventory";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { Spin } from "antd";
import { CSSProperties, useEffect, useState } from "react";

type Props = {
  style?: CSSProperties;
  tool: FreezerToolType;
};

const FreezerClientItem = ({ style, tool }: Props) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(cartSelector);
  const [tool_id, $tool_id] = useState<number>();

  const { data: tool_info, isFetching } = getFreezerBalances({
    enabled: !!tool_id,
    id: tool_id!,
  });

  const addToCart = async (id: number) => {
    $tool_id(id);
    const my_tool = await tool_info;
    // if (!!my_tool?.amount) dispatch(addItem(tool));
  };

  useEffect(() => {
    if (tool_id === tool_info?.tool?.id && !!tool_info?.amount)
      dispatch(addItem(tool));
  }, [tool_info, tool_id]);

  const handleIncrement = () => {
    if (tool_info?.amount && tool_info?.amount > cart?.[tool.id]?.count)
      dispatch(incrementSelected(tool.id?.toString()));
    else if (!tool_info?.amount)
      dispatch(incrementSelected(tool.id?.toString()));
    return;
  };

  return (
    <div
      style={style}
      className="rounded-3xl flex gap-5 w-full bg-white h-18 overflow-hidden"
    >
      <div className="flex flex-1 justify-between pt-3 flex-col">
        <div className="flex flex-1 justify-center ml-4 flex-col">
          <h5 className="font-bold text-base">{tool?.name}</h5>
          {tool_info && tool_id === tool.id && (
            <p className="text-red-400 text-xs">
              {!!tool_info?.amount
                ? `Остаток - ${tool_info?.amount}`
                : "Этот товар пока нет на складе"}
            </p>
          )}
        </div>

        <div className="bg-tgPrimary flex items-center justify-center rounded-tl-3xl w-20 h-9 self-end">
          {!isFetching ? (
            !cart[tool.id] ? (
              <button
                className="flex flex-1 justify-center"
                onClick={() => addToCart(+tool.id)}
              >
                <img src="/icons/cart.svg" alt="cart" height={20} width={20} />
              </button>
            ) : (
              <div className="flex justify-evenly flex-1  text-white ">
                <button
                  className="flex flex-1 justify-center"
                  onClick={() =>
                    dispatch(decrementSelected(tool?.id?.toString()))
                  }
                >
                  -
                </button>
                <span className="flex flex-1 justify-center">
                  {cart[tool.id]?.count}
                </span>
                <button
                  className="flex flex-1 justify-center"
                  onClick={handleIncrement}
                >
                  +
                </button>
              </div>
            )
          ) : (
            <Spin size="small" />
          )}
        </div>
      </div>
    </div>
  );
};

export default FreezerClientItem;
