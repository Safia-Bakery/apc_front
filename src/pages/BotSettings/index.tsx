import Card from "@/components/Card";
import Header from "@/components/Header";
import Loading from "@/components/Loader";
import apcBotMutation from "@/hooks/mutation/apcBot";
import successToast from "@/utils/successToast";

const BotSettings = () => {
  const { mutate, isPending } = apcBotMutation();

  const handleRestart = () =>
    mutate(undefined, { onSuccess: () => successToast("success") });

  return (
    <Card>
      <Header title="bot_settings" />
      {isPending && <Loading />}

      <ul className="w-full p-2">
        <li className="flex flex-1 justify-between items-center p-3 border border-mainGray hover:bg-mainGray transition-colors rounded-md">
          <span>Apc Bot</span>
          <button onClick={handleRestart} className="btn btn-success">
            restart
          </button>
        </li>
      </ul>
    </Card>
  );
};

export default BotSettings;
