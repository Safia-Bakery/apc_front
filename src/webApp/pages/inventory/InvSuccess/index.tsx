import { TelegramApp } from "@/utils/tgHelpers";
import InvButton, { InvBtnType } from "@/webApp/components/InvButton";
import InvHeader from "@/webApp/components/web-header";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

interface Props {
  freezer?: boolean;
  title?: string;
}

const InvSuccess = ({ freezer = false, title = "Корзина" }: Props) => {
  const { t } = useTranslation();
  const { id } = useParams();
  return (
    <>
      <div className="absolute top-0 left-0 right-0">
        <InvHeader title={title} />
        <div className="bg-white h-[52px]" />
      </div>
      <WebAppContainer className="h-svh flex items-center justify-center flex-col">
        <img src="/images/safia.jpg" alt="" width={170} height={75} />
        <h3 className="text-lg text-center mt-2">
          {t("appreciate_for_order")}
        </h3>
        <div className="flex justify-between my-8">
          <span>
            {t("you_request_order")}: <span className="font-bold">{id}</span>
          </span>
        </div>
        <p className="text-center ">{t("your_request_received")}</p>
        {!freezer && (
          <p className="text-center">{t("approximate_delivery_time")}</p>
        )}
        <div className="flex gap-3 mt-14 w-full">
          <InvButton
            btnType={InvBtnType.white}
            onClick={() => TelegramApp.toMainScreen()}
            className="flex-1"
          >
            {t("to_main")}
          </InvButton>
          <InvButton
            className="flex-1"
            onClick={() => TelegramApp.toMainScreen()}
          >
            {t("to_close")}
          </InvButton>
        </div>
      </WebAppContainer>
    </>
  );
};

export default InvSuccess;
