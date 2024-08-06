import {
  branchSelector,
  cartSelector,
  clearCart,
} from "@/store/reducers/webInventory";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { useEffect } from "react";
import InvButton, { InvBtnType } from "@/webApp/components/InvButton";
import InvHeader from "@/webApp/components/InvHeader";
import { useLocation, useNavigate } from "react-router-dom";
import ToolCard from "@/webApp/components/ToolCard";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import BaseInput from "@/components/BaseInputs";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import requestMutation from "@/hooks/mutation/orderMutation";
import { useForm } from "react-hook-form";
import { errorToast } from "@/utils/toast";
import Loading from "@/components/Loader";

const InvCart = () => {
  const navigate = useNavigate();
  const selectedBranch = useAppSelector(branchSelector);
  const { state } = useLocation();
  const dispatch = useAppDispatch();
  const cart = useAppSelector(cartSelector);
  const { mutate, isPending: mutating } = requestMutation();
  const { getValues, register } = useForm();

  const handleSubmit = () => {
    const { comment } = getValues();

    const expenditure = Object.entries(cart).reduce(
      (acc: any, [key, value]) => {
        acc[key] = [value.count, " "];
        return acc;
      },
      {}
    );
    mutate(
      {
        category_id: state?.category_id,
        fillial_id: selectedBranch?.id!,
        expenditure,
        description: !!comment ? comment : " ",
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

  useEffect(() => {
    if (!selectedBranch?.id) navigate("/tg/inventory-request/add-order");
  }, [selectedBranch?.id]);

  return (
    <div className="overflow-hidden h-svh">
      {mutating && <Loading />}
      <InvHeader title={"Корзина"} goBack />
      <div className="bg-white h-[52px]" />

      <WebAppContainer className="mt-4 overflow-y-auto h-[60vh] mb-24">
        <div className="flex flex-col gap-4">
          {Object.values(cart).map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
        <BaseInput
          className="mt-4"
          label="При желании можно оставить комментарии"
        >
          <MainTextArea
            placeholder={"Введите"}
            register={register("comment")}
          />
        </BaseInput>

        <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-5 z-[105]">
          <InvButton
            btnType={InvBtnType.primary}
            className="w-full"
            disabled={!Object.values(cart).length}
            onClick={handleSubmit}
          >
            Подтвердить заказ
          </InvButton>
        </div>
      </WebAppContainer>
    </div>
  );
};

export default InvCart;
