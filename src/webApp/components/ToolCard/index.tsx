import Modal from "@/components/Modal";
import {
  useNavigateParams,
  useRemoveParams,
} from "@/hooks/custom/useCustomNavigate";
import useQueryString from "@/hooks/custom/useQueryString";
import { baseURL } from "@/main";
import {
  addItem,
  cartSelector,
  decrementSelected,
  incrementSelected,
} from "@/store/reducers/webInventory";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { detectFileType } from "@/utils/helpers";
import { FileType, ModalTypes, ToolItemType } from "@/utils/types";
import { CSSProperties } from "react";

type Props = {
  style?: CSSProperties;
  tool: ToolItemType;
};

const ToolCard = ({ style, tool }: Props) => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(cartSelector);
  const photo = useQueryString("photo");
  const modal = useQueryString("modal");
  const navigateParams = useNavigateParams();
  const removeParams = useRemoveParams();

  const handleClose = () => removeParams(["modal", "photo"]);

  const handleShowPhoto = (file: string) => {
    if (detectFileType(file) === FileType.other) return window.open(file);
    else navigateParams({ modal: ModalTypes.showPhoto, photo: file });
  };

  return (
    <div
      style={style}
      className="rounded-3xl overflow-hidden flex gap-5 w-full bg-white h-32"
    >
      <Modal
        isOpen={!!modal}
        onClose={handleClose}
        className="!max-h-svh h-full"
      >
        <button
          onClick={handleClose}
          className={
            "absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center border border-white"
          }
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <img
          src={photo!}
          className={"object-contain block h-full"}
          alt="uploaded-file"
        />
      </Modal>
      <div
        onClick={() =>
          !!tool.image && handleShowPhoto(`${baseURL}/${tool.image}`)
        }
      >
        <img
          src={
            !!tool.image
              ? `${baseURL}/${tool.image}`
              : "/assets/images/safia.png"
          }
          height={130}
          width={130}
          className="rounded-2xl object-contain"
          alt=""
        />
      </div>

      <div className="flex flex-1 justify-between pt-3 flex-col">
        <div className="flex flex-1 items-center">
          <h5 className="font-bold text-base">{tool?.name}</h5>
          {/* <p className="text-tgTextGray">{tool.producttype}</p> */}
        </div>

        <div className="bg-tgPrimary flex items-center justify-center rounded-tl-3xl w-20 h-9 self-end">
          {!cart[tool.id] ? (
            <button
              className="flex flex-1 justify-center"
              onClick={() => dispatch(addItem(tool))}
            >
              <img
                src="/assets/icons/cart.svg"
                alt="cart"
                height={20}
                width={20}
              />
            </button>
          ) : (
            <div className="flex justify-evenly flex-1  text-white ">
              <button
                className="flex flex-1 justify-center"
                onClick={() => dispatch(decrementSelected(tool.id))}
              >
                -
              </button>
              <span className="flex flex-1 justify-center">
                {cart[tool.id].count}
              </span>
              <button
                className="flex flex-1 justify-center"
                onClick={() => dispatch(incrementSelected(tool.id))}
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
