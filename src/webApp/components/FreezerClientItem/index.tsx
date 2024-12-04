import {
  addItem,
  cartSelector,
  decrementSelected,
  incrementSelected,
} from "@/store/reducers/webInventory";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { CSSProperties } from "react";

type Props = {
  style?: CSSProperties;
  tool: FreezerToolType;
};

const FreezerClientItem = ({ style, tool }: Props) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(cartSelector);

  const handleIncrement = () => {
    if (tool?.count && tool?.count > cart[tool.id].count)
      dispatch(incrementSelected(tool.id?.toString()));
    // else if (!tool?.count) dispatch(incrementSelected(tool.id?.toString()));
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

          <p className="text-gray-500 text-xs">Остаток: {tool.count || 0}</p>
        </div>

        <div className="bg-tgPrimary flex items-center justify-center rounded-tl-3xl w-20 h-9 self-end">
          {!cart[tool.id] ? (
            <button
              className="flex flex-1 justify-center"
              onClick={() => tool.count && dispatch(addItem(tool))}
            >
              <img src="/icons/cart.svg" alt="cart" height={20} width={20} />
            </button>
          ) : (
            <div className="flex justify-evenly flex-1  text-white ">
              <button
                className="flex flex-1 justify-center"
                onClick={() => dispatch(decrementSelected(tool.id?.toString()))}
              >
                -
              </button>
              <span className="flex flex-1 justify-center">
                {cart[tool.id].count}
              </span>
              <button
                className="flex flex-1 justify-center"
                onClick={handleIncrement}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreezerClientItem;
