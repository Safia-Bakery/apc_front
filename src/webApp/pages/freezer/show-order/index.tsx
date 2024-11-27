import Loading from "@/components/Loader";
import { freezerRequestMutation, getFreezerRequest } from "@/hooks/freezer";
import { freezerState } from "@/store/reducers/freezer";
import { useAppDispatch, useAppSelector } from "@/store/utils/types";
import { dateTimeFormat } from "@/utils/keys";
import FreezerItem from "@/webApp/components/FreezerItem";
import InvHeader from "@/webApp/components/InvHeader";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { Empty, Flex } from "antd";
import dayjs from "dayjs";
import { CheckOutlined } from "@ant-design/icons";
import {
  addItem,
  cartSelector,
  clearCart,
} from "@/store/reducers/webInventory";
import InvButton, { BtnSize, InvBtnType } from "@/webApp/components/InvButton";
import { TelegramApp } from "@/utils/tgHelpers";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import warnToast from "@/utils/warnToast";

const ShowOrder = () => {
  const { order_id, message_id } = useAppSelector(freezerState);
  const dispatch = useAppDispatch();
  const cart = useAppSelector(cartSelector);
  const { data, isLoading } = getFreezerRequest({
    enabled: !!order_id,
    id: +order_id!,
  });

  const { mutate, isPending } = freezerRequestMutation();

  const handleRequest = () => {
    if (!!Object.keys(cart)?.length)
      mutate(
        {
          id: Number(order_id),
          status: 1,
          message_id,
        },
        {
          onSuccess: () => {
            TelegramApp.toMainScreen();
            successToast("Успешно изменен");
          },
          onError: (e) => errorToast(e.message),
        }
      );
    else warnToast("Выберите продукт", "Нужно выбрать хотябы один продукт");
  };

  const handleSelectAll = () => {
    if (data?.order_item?.length !== Object.keys(cart)?.length) {
      data?.order_item.forEach(({ product: tool, amount }) =>
        dispatch(
          addItem({
            image: tool.image,
            name: tool.name,
            id: tool.id,
            count: amount,
          })
        )
      );
    } else dispatch(clearCart());
  };

  if (isLoading) return <Loading />;

  return (
    <>
      {isPending && <Loading />}
      <InvHeader sticky title={`Заказ №${order_id}`} />

      <WebAppContainer className="mt-4 overflow-y-auto mb-2">
        <Flex vertical className={"overflow-y-auto"}>
          <span>
            <span className={"font-bold"}>Филиал:</span> {data?.branch?.name}
          </span>
          <span>
            <span className={"font-bold"}>Создатель:</span>{" "}
            {data?.created_user?.full_name}
          </span>
          <span>
            <span className={"font-bold"}>Время оформления:</span>{" "}
            {dayjs(data?.created_at).format(dateTimeFormat)}
          </span>
        </Flex>
        <div className="flex flex-col gap-4">
          <Flex
            className="p-2 bg-white rounded-lg my-3"
            justify="space-between"
            align="center"
            gap={8}
          >
            <h3>Продукты</h3>
            <InvButton
              btnSize={BtnSize.medium}
              btnType={InvBtnType.primary}
              onClick={handleSelectAll}
            >
              <CheckOutlined className="bg-transparent" />
              <CheckOutlined className="-ml-[10px] bg-transparent" />
            </InvButton>
          </Flex>
          {!!data?.order_item?.length ? (
            data?.order_item?.map(({ product: tool, amount }) => (
              <FreezerItem
                tool={{
                  image: tool.image,
                  name: tool.name,
                  id: tool.id,
                  count: amount,
                }}
                key={tool.id}
              />
            ))
          ) : (
            <Empty description={"Список пуст"} />
          )}
        </div>

        <InvButton
          btnType={InvBtnType.primary}
          disabled={!data?.order_item?.length || isPending}
          className="w-full !h-11 mt-3"
          onClick={handleRequest}
        >
          Закрыть
        </InvButton>
      </WebAppContainer>
    </>
  );
};

export default ShowOrder;
