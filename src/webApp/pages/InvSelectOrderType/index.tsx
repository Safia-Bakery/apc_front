import InvHeader from "@/webApp/components/InvHeader";
import invOrderType from "/assets/icons/invOrderType.svg";
import arrow from "/assets/icons/arrowBlack.svg";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import CustomLink from "@/webApp/components/CustomLink";
import { useEffect } from "react";
import { TelegramApp } from "@/utils/tgHelpers";

const InvSelectOrderType = () => {
  useEffect(() => {
    TelegramApp?.confirmClose();
  }, []);

  return (
    <div>
      <InvHeader title="Инвентарь" />

      <WebAppContainer>
        <CustomLink
          to={"add-order"}
          className="flex bg-[#F9EED9] items-center rounded-2xl mb-4 px-4 py-3"
        >
          <img src={invOrderType} alt="order-icon" />

          <div className="flex flex-1 flex-col mx-2">
            <h6 className="mb-1 font-normal text-base text-left text-black">
              Подать заявку
            </h6>

            <p className="text-xs text-gray-400 text-left">
              Здесь можете оформить заявку в отдел Инвентаря
            </p>
          </div>

          <button>
            <img src={arrow} alt="arrow" className="rotate-90" />
          </button>
        </CustomLink>
        <CustomLink
          to={"archieve"}
          className="flex bg-[#F9EED9] items-center rounded-2xl mb-4 px-4 py-3 text-black"
        >
          <img src={invOrderType} alt="order-icon" />

          <div className="flex flex-1 flex-col mx-2">
            <h6 className="mb-1 font-normal text-base text-left">Архив</h6>

            <p className="text-xs text-gray-400 text-left">
              Здесь можете посмотреть за статусами всех заявок
            </p>
          </div>

          <button>
            <img src={arrow} alt="arrow" className="rotate-90" />
          </button>
        </CustomLink>
      </WebAppContainer>
    </div>
  );
};

export default InvSelectOrderType;
