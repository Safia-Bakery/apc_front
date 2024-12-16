import { TelegramApp } from "@/utils/tgHelpers";
import InvButton, { InvBtnType } from "@/webApp/components/InvButton";
import InvHeader from "@/webApp/components/web-header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { useParams } from "react-router-dom";

interface Props {
  freezer?: boolean;
  title?: string;
}

const InvSuccess = ({ freezer = false, title = "Корзина" }: Props) => {
  const { id } = useParams();
  return (
    <>
      <div className="absolute top-0 left-0 right-0">
        <InvHeader title={title} />
        <div className="bg-white h-[52px]" />
      </div>
      <WebAppContainer className="h-svh flex items-center justify-center flex-col">
        <img src="/images/safia.jpg" alt="" width={170} height={75} />
        <h3 className="text-lg text-center mt-2">Спасибо за заявку!</h3>
        <div className="flex justify-between my-8">
          <span>
            Номер вашей заяки: <span className="font-bold">{id}</span>
          </span>
        </div>
        <p className="text-center ">Ваша заявка принята.</p>
        {!freezer && (
          <p className="text-center">Примерное время доставки: 24 ч.</p>
        )}
        <div className="flex gap-3 mt-14 w-full">
          <InvButton
            btnType={InvBtnType.white}
            onClick={() => TelegramApp.toMainScreen()}
            className="flex-1"
          >
            На главную
          </InvButton>
          <InvButton
            className="flex-1"
            onClick={() => TelegramApp.toMainScreen()}
          >
            Закрыть
          </InvButton>
        </div>
      </WebAppContainer>
    </>
  );
};

export default InvSuccess;
