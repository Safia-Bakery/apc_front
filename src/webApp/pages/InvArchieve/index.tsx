import InvHeader from "@/webApp/components/InvHeader";
import calendar from "/assets/icons/calendar.svg";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import InvButton, { BtnSize, InvBtnType } from "@/webApp/components/InvButton";
import arrow from "/assets/icons/arrowBlack.svg";
import { useState } from "react";
import cl from "classnames";

const InvArchieve = () => {
  const [orderStatus, $orderStatus] = useState(1);
  const [selectedItem, $selectedItem] = useState<number>();
  return (
    <div className="flex flex-col">
      <InvHeader
        title="Архив"
        goBack
        rightChild={
          <button>
            <img src={calendar} alt="calendar" />
          </button>
        }
      />

      <div className="bg-white">
        <WebAppContainer className="flex gap-2">
          <InvButton
            className="flex flex-1 items-center justify-center"
            onClick={() => $orderStatus(1)}
            btnType={orderStatus === 2 ? InvBtnType.white : InvBtnType.primary}
            btnSize={BtnSize.medium}
          >
            В работе
          </InvButton>
          <InvButton
            className="flex flex-1 items-center justify-center"
            onClick={() => $orderStatus(2)}
            btnType={orderStatus === 1 ? InvBtnType.white : InvBtnType.primary}
            btnSize={BtnSize.medium}
          >
            Закрытые
          </InvButton>
        </WebAppContainer>
      </div>

      <WebAppContainer className="flex flex-col gap-3 h-full overflow-y-auto flex-1">
        {[...Array(6)].map((_, idx) => (
          <div className="px-6 py-3 rounded-xl bg-white" key={idx}>
            {/* card */}
            <div className="flex w-full gap-2">
              <span className="text-tgTextGray flex flex-1">Номер заявки</span>
              <span className=" text-right flex flex-1 justify-end">
                123456
              </span>
            </div>
            <div className="flex w-full gap-2 mt-1">
              <span className="text-tgTextGray flex flex-1">Филиал</span>
              <span className=" text-right flex flex-1 justify-end">ZENIT</span>
            </div>
            <div className="flex w-full gap-2 mt-1">
              <span className="text-tgTextGray flex flex-1">Дата</span>
              <span className=" text-right flex flex-1 justify-end">
                10.07.2024 — 09:41
              </span>
            </div>
            <div className="flex w-full gap-2 mt-1">
              <span className="text-tgTextGray flex flex-1">Статус</span>
              <span className=" text-right flex flex-1 justify-end">
                В ожидании
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
              {[...Array(4)].map((_, childIdx) => (
                <div
                  key={childIdx}
                  className="flex w-full gap-2 mt-1 border-dashed last:border-none border-b border-[#E4E4E4] py-1"
                >
                  <span className="flex flex-1">Инвентарь №{childIdx + 1}</span>
                  <span className="text-tgTextGray text-right flex flex-1 justify-end">
                    {childIdx + 1} x
                  </span>
                </div>
              ))}
              <p className="text-tgTextGray mt-2">
                Комментарии: тестовый комментарии
              </p>
            </div>
          </div>
        ))}
      </WebAppContainer>
    </div>
  );
};

export default InvArchieve;
