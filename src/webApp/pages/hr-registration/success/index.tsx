import { TelegramApp } from "@/utils/tgHelpers";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { Button } from "antd";
import dayjs from "dayjs";
import { useLocation, useParams } from "react-router-dom";

const HrSuccess = () => {
  const location = useLocation();
  const { id } = useParams();
  const state = location.state as HrAppointmentRes;

  return (
    <WebAppContainer>
      <h1 className="text-center mt-4">
        <p className="font-bold text-inherit">Спасибо!</p>
        Ваша запись #{id} на официальное оформление принята{" "}
        <img src="/icons/green-tick.svg" className="inline-block" alt="tick" />
      </h1>

      <p className="my-6 text-[#000000CC]">Вы записали: </p>

      <p>Филиал: {state?.branch?.name} </p>
      <p>Фио: {state?.employee_name}</p>
      <p>Должность: {state?.position?.name}</p>
      {state?.description && (
        <p>Комментарий (если для другого филиала): {state?.description}</p>
      )}
      <p>Дата: {dayjs(state?.time_slot).format("dddd DD.MM.YYYY")}</p>
      <p>Время: {dayjs(state?.time_slot).format("HH:mm")}</p>

      <p className="text-center font-bold mt-8">
        <span className="text-[#FF0000]">Важно!</span> Сотрудник должен прийти
        на оформление с полностью заполненной личной анкетой. Шаблон анкеты
        отправим вам чат.
      </p>

      <Button
        className="flex-1 bg-[#0B0155] w-full rounded-full text-white mt-3"
        onClick={() => TelegramApp.toMainScreen()}
      >
        Закрыть
      </Button>
    </WebAppContainer>
  );
};

export default HrSuccess;
