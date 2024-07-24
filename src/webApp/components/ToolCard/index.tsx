import {
  addItem,
  cartSelector,
  decrementSelected,
  incrementSelected,
} from "@/store/reducers/webInventory";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { InventoryTools } from "@/utils/types";
import { CSSProperties } from "react";

type Props = {
  style?: CSSProperties;
  tool: InventoryTools;
};

const ToolCard = ({ style, tool }: Props) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(cartSelector);

  return (
    <div
      style={style}
      className="rounded-3xl overflow-hidden flex gap-5 w-full bg-white"
    >
      <img
        src={tool.image}
        height={130}
        width={130}
        className="rounded-2xl object-contain"
        alt=""
      />

      <div className="flex flex-1 justify-between pt-3 flex-col">
        <div className="">
          <h5 className="font-bold text-base">{tool?.name}</h5>
          <p className="text-tgTextGray">{tool.producttype}</p>
        </div>

        <div className="bg-tgPrimary flex items-center justify-center rounded-tl-3xl w-20 h-9 self-end">
          {!cart[tool.id] ? (
            <button onClick={() => dispatch(addItem(tool))}>
              <img
                src="/assets/icons/cart.svg"
                alt="cart"
                height={20}
                width={20}
              />
            </button>
          ) : (
            <div className="flex gap-3 text-white">
              <button onClick={() => dispatch(decrementSelected(tool.id))}>
                -
              </button>
              <span>{cart[tool.id].count}</span>
              <button onClick={() => dispatch(incrementSelected(tool.id))}>
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
