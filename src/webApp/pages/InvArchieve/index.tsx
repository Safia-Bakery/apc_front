import InvHeader from "@/webApp/components/InvHeader";
import calendar from "/icons/calendar.svg";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import InvButton, { BtnSize, InvBtnType } from "@/webApp/components/InvButton";
import arrow from "/icons/arrowBlack.svg";
import { useRef, useState } from "react";
import cl from "classnames";
import useWebInvOrders from "@/hooks/useWebInvOrders";
import Loading from "@/components/Loader";
import dayjs from "dayjs";
import { dateTimeFormatWeb, yearMonthDate } from "@/utils/keys";
import { RequestStatus } from "@/utils/types";
import { useTranslation } from "react-i18next";
import Pagination from "@/components/Pagination";
import EmptyList from "@/components/EmptyList";
import ReactDatePicker from "react-datepicker";
import InvPagination from "@/webApp/components/InvPagination";

const date = new Date();
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

const InvArchieve = () => {
  const { t } = useTranslation();
  const [orderStatus, $orderStatus] = useState(0);
  const [selectedItem, $selectedItem] = useState<number>();
  const startRef = useRef<any>(null);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    firstDay,
    date,
  ]);
  const [startDate, endDate] = dateRange;

  const {
    data: orders,
    isLoading,
    isFetching,
  } = useWebInvOrders({
    status: orderStatus,
    to_date: dayjs(endDate).format(yearMonthDate),
    from_date: dayjs(startDate).format(yearMonthDate),
    enabled: !!endDate && !!startDate,
  });

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col">
      <InvHeader
        title="Архив"
        goBack
        rightChild={
          <button onClick={() => startRef.current?.setOpen(true)}>
            <img src={calendar} alt="calendar" />
            <ReactDatePicker
              className="!border mb-6 !border-[#0000000F] rounded-lg max-w-80 w-full text-center hidden py-2"
              selectsRange
              startDate={startDate}
              endDate={endDate}
              ref={startRef}
              onChange={(update) => {
                setDateRange(update);
              }}
            />
          </button>
        }
      />

      <div className="bg-white">
        <WebAppContainer className="flex gap-2">
          <InvButton
            className="flex flex-1 items-center justify-center"
            onClick={() => $orderStatus(0)}
            btnType={orderStatus === 0 ? InvBtnType.primary : InvBtnType.white}
            btnSize={BtnSize.medium}
          >
            В работе
          </InvButton>
          <InvButton
            className="flex flex-1 items-center justify-center"
            onClick={() => $orderStatus(1)}
            btnType={orderStatus === 1 ? InvBtnType.primary : InvBtnType.white}
            btnSize={BtnSize.medium}
          >
            Закрытые
          </InvButton>
        </WebAppContainer>
      </div>

      <WebAppContainer className="flex flex-col gap-3 h-full overflow-y-auto flex-1">
        {orders?.items?.map((order, idx) => (
          <div
            className="px-6 py-3 rounded-xl bg-white"
            key={order?.id + idx + order?.created_at}
          >
            {/* card */}
            <div className="flex w-full gap-2">
              <span className="text-tgTextGray flex flex-1">Номер заявки</span>
              <span className=" text-right flex flex-1 justify-end">
                {order?.id}
              </span>
            </div>
            <div className="flex w-full gap-2 mt-1">
              <span className="text-tgTextGray flex flex-1">Филиал</span>
              <span className=" text-right flex flex-1 justify-end">
                {order?.fillial?.name}
              </span>
            </div>
            <div className="flex w-full gap-2 mt-1">
              <span className="text-tgTextGray flex flex-1">Дата</span>
              <span className=" text-right flex flex-1 justify-end">
                {dayjs(order?.created_at).format(dateTimeFormatWeb)}
              </span>
            </div>
            <div className="flex w-full gap-2 mt-1">
              <span className="text-tgTextGray flex flex-1">Статус</span>
              <span className=" text-right flex flex-1 justify-end">
                {order?.status?.toString() && t(RequestStatus[order?.status])}
              </span>
            </div>
            <div className="w-full h-[1px] bg-[#E4E4E4] mt-1" />

            <button
              className="flex w-full gap-2 mt-2"
              onClick={() => $selectedItem(idx)}
            >
              <span className="font-bold flex flex-1 ">Посмотреть заказ</span>
              <span className=" text-right flex flex-1 justify-end">
                <img
                  src={arrow}
                  alt="open"
                  className={`transition-transform ${
                    selectedItem === idx && "rotate-180"
                  }`}
                />
              </span>
            </button>

            <div
              className={cl(
                "overflow-hidden h-0 transition-opacity my-2 opacity-0 duration-500",
                {
                  ["h-max opacity-100"]: selectedItem === idx,
                }
              )}
            >
              {order?.expanditure?.map((item, childIdx) => (
                <div
                  key={item?.id + childIdx + item.created_at}
                  className="flex w-full gap-2 mt-1 border-dashed last:border-none border-b border-[#E4E4E4] py-1"
                >
                  <span className="flex flex-1">{item?.tool?.name}</span>
                  <span className="text-tgTextGray text-right flex flex-1 justify-end">
                    {item?.amount} x
                  </span>
                </div>
              ))}
              <p className="text-tgTextGray mt-2">
                {order?.comments?.comment &&
                  `Комментарии: ${order?.comments?.comment}`}
              </p>
            </div>
          </div>
        ))}

        {isFetching && <Loading />}
        {!orders?.items?.length && !isLoading && <EmptyList />}
        {!!orders && <InvPagination totalPages={orders?.pages} />}
      </WebAppContainer>
    </div>
  );
};

export default InvArchieve;
