import {
  branchSelector,
  cartSelector,
  clearCart,
} from "@/store/reducers/webInventory";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { useEffect, useState } from "react";
import InvButton, { InvBtnType } from "@/webApp/components/InvButton";
import InvHeader from "@/webApp/components/web-header";
import { useLocation, useNavigate } from "react-router-dom";
import ToolCard from "@/webApp/components/ToolCard";
import MainTextArea from "@/components/BaseInputs/MainTextArea";
import BaseInput from "@/components/BaseInputs";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { useForm } from "react-hook-form";
import errorToast from "@/utils/errorToast";
import Loading from "@/components/Loader";
import { invRequestMutation } from "@/hooks/inventory";
import { deptSelector } from "@/store/reducers/auth";
import { Departments } from "@/utils/types";
import { invFabricCategory } from "@/utils/keys";
import MainDropZone from "@/components/MainDropZone";
import { fixedString } from "@/utils/helpers";
import InputMask from "@/components/BaseInputs/InputMask";

const InvCart = () => {
  const navigate = useNavigate();
  const selectedBranch = useAppSelector(branchSelector);
  const dep = useAppSelector(deptSelector);
  const { state } = useLocation();
  const dispatch = useAppDispatch();
  const [uploadedFiles, $uploadedFiles] = useState<string[]>([]);
  const cart = useAppSelector(cartSelector);
  const [phone_number, $phone_number] = useState<string>("");
  const { mutate, isPending: mutating } = invRequestMutation();

  const {
    getValues,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    if (fixedString(phone_number || "").length < 9) {
      errorToast("Введите правильный номер телефона");
    } else {
      const { comment } = getValues();
      const expenditure = Object.entries(cart).map((item) => ({
        tool_id: Number(item[0]),
        amount: item?.[1]?.count,
      }));
      mutate(
        {
          category_id:
            dep === Departments.inventory_factory
              ? invFabricCategory
              : state?.category_id,
          fillial_id: selectedBranch?.id!,
          expenditure,
          department: dep,
          ...(fixedString(phone_number).length > 7 && {
            phone_number: fixedString(phone_number),
          }),
          description: !!comment ? comment : " ",
          ...(!!uploadedFiles.length && { files: uploadedFiles }),
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
    }
  };

  useEffect(() => {
    if (!selectedBranch?.id) navigate("/tg/inventory-request/add-order");
  }, [selectedBranch?.id]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="overflow-y-auto h-svh pb-16"
    >
      {mutating && <Loading />}
      <InvHeader title={"Корзина"} goBack />
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
            type="submit"
            className="w-full"
            disabled={!Object.values(cart).length && mutating}
          >
            Подтвердить заказ
          </InvButton>
        </div>
      </WebAppContainer>
      <WebAppContainer>
        {dep === Departments.inventory_factory && (
          <MainDropZone
            setData={$uploadedFiles}
            defaultFiles={uploadedFiles}
            btnLabel="Загрузить фото"
          />
        )}

        <BaseInput label="Номер телефона" error={errors.phone_number}>
          <InputMask
            className="form-control mb-2"
            mask="(999-99)-999-99-99"
            defaultValue={"998"}
            onChange={(e) => $phone_number(e.target.value)}
            // {...register("phone_number", {
            //   required: "Обязательное поле",
            //   min: 9,
            // })}
          />
        </BaseInput>

        <BaseInput
          className="mt-4"
          label="При желании можно оставить комментарии"
        >
          <MainTextArea
            placeholder={"Введите"}
            register={register("comment")}
          />
        </BaseInput>
      </WebAppContainer>
    </form>
  );
};

export default InvCart;
