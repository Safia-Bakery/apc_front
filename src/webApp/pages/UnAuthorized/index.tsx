import { TelegramApp } from "@/utils/tgHelpers";
import InvButton from "@/webApp/components/InvButton";

const UnAuthorized = () => {
  return (
    <div className="h-svh w-full flex flex-col items-center justify-center gap-4">
      <img
        src="/images/safia.png"
        alt="safia-logo"
        className="max-w-64 w-full"
      />

      <h1 className="text-2xl text-center">
        Срок действия вашего токена истек
      </h1>
      <InvButton onClick={() => TelegramApp.toMainScreen()}>Закрыть</InvButton>
    </div>
  );
};

export default UnAuthorized;
