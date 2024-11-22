import { cartSelector, clearCart } from "@/store/reducers/webInventory";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import InvButton, { InvBtnType } from "@/webApp/components/InvButton";
import InvHeader from "@/webApp/components/InvHeader";
import { useNavigate } from "react-router-dom";
import ToolCard from "@/webApp/components/ToolCard";
import WebAppContainer from "@/webApp/components/WebAppContainer";

import errorToast from "@/utils/errorToast";
import Loading from "@/components/Loader";
import { freezerRequestMutation } from "@/hooks/freezer";

const FreezerCart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(cartSelector);
  const { mutate, isPending: mutating } = freezerRequestMutation();

  const handleSubmit = () => {
    const expenditure = Object.entries(cart).map((item) => ({
      product_id: Number(item[0]),
      amount: item?.[1]?.count,
    }));

    mutate(
      {
        products: expenditure,
      },
      {
        onSuccess: (data) => {
          dispatch(clearCart());
          navigate(`/tg/inventory-request/success/${data.id}`, {
            replace: true,
          });
        },
        onError: (e) => errorToast(e.message),
      }
    );
  };

  return (
    <div className="overflow-y-auto h-svh pb-16">
      <InvHeader goBack sticky title={"Корзина"} />
      {mutating && <Loading />}
      <div className="bg-white h-[52px]" />

      <WebAppContainer className="mt-4 overflow-y-auto max-h-[50vh] h-min mb-2">
        <div className="flex flex-col gap-4">
          {Object.values(cart).map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-5 z-[105]">
          <InvButton
            btnType={InvBtnType.primary}
            className="w-full"
            disabled={!Object.values(cart).length || mutating}
            onClick={handleSubmit}
          >
            Подтвердить заказ
          </InvButton>
        </div>
      </WebAppContainer>
    </div>
  );
};

export default FreezerCart;
