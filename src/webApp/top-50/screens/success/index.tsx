import { TelegramApp } from "@/utils/tgHelpers";
import InvButton from "@/webApp/components/InvButton";
import InvHeader from "@/webApp/components/web-header";
import WebAppContainer from "@/webApp/components/WebAppContainer";

const Top50Success = () => {
  return (
    <>
      <div className="absolute top-0 left-0 right-0">
        <InvHeader title={""} />
        <div className="bg-white h-[52px]" />
      </div>
      <WebAppContainer className="h-svh flex items-center justify-center flex-col">
        <img src="/images/safia.png" alt="" width={170} height={75} />
        <h3 className="text-lg text-center mt-2">
          Отлично вы выполняли все задачи!
        </h3>
        <div className="flex gap-3 mt-14 w-full">
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

export default Top50Success;
