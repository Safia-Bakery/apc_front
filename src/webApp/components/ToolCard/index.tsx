import { baseURL } from "@/store/baseUrl";
import {
  addItem,
  cartSelector,
  decrementSelected,
  incrementSelected,
} from "@/store/reducers/webInventory";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { Image } from "antd";
import { CSSProperties } from "react";

type Props = {
  style?: CSSProperties;
  tool: FreezerToolType;
};

const ToolCard = ({ style, tool }: Props) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(cartSelector);

  return (
    <div
      style={style}
      className="rounded-3xl flex gap-5 w-full bg-white h-32 overflow-hidden"
    >
      <Image
        src={!!tool.image ? `${baseURL}/${tool.image}` : "/images/safia.png"}
        height={130}
        width={130}
        className="rounded-2xl object-contain"
        alt=""
      />

      <div className="flex flex-1 justify-between pt-3 flex-col">
        <div className="flex flex-1 items-center">
          <h5 className="font-bold text-base">{tool?.name}</h5>
        </div>

        <div className="bg-tgPrimary flex items-center justify-center rounded-tl-3xl w-20 h-9 self-end">
          {!cart[tool.id] ? (
            <button
              className="flex flex-1 justify-center"
              onClick={() => dispatch(addItem(tool))}
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
                onClick={() => dispatch(incrementSelected(tool.id?.toString()))}
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

export default ToolCard;
