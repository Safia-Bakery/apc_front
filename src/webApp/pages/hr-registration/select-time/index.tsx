import { editAddAppointment, getHrTimeSlots } from "@/hooks/hr-registration";
import { getSchedules } from "@/hooks/schedules";
import errorToast from "@/utils/errorToast";
import { yearMonthDate } from "@/utils/keys";
import warnToast from "@/utils/warnToast";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { Button, Flex } from "antd";
import cl from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const HRSelectTime = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [selectedDate, $selectedDate] = useState<Dayjs>();
  const [selectedTime, $selectedTime] = useState<string>();

  const { mutate, isPending } = editAddAppointment();
  const { data: schedules, isLoading } = getSchedules({});

  const { data: timeSlots, refetch: timeRefetch } = getHrTimeSlots({
    query_date: dayjs(selectedDate).format(yearMonthDate),
    enabled: !!selectedDate,
  });

  const handleSelectTime = (item: string) => {
    if (!timeSlots?.reserved?.[item]) $selectedTime(item);
    else
      warnToast(
        "Это время уже забронирован!",
        "Пожалуйста выберите другое время"
      );
  };

  const twoWeeks = useMemo(() => {
    const weekdays: Dayjs[] = [];
    let currentDate: Dayjs = dayjs();
    const endDate: Dayjs = currentDate.add(1.9, "week");

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
      const dayOfWeek = currentDate.day();
      // Exclude Saturdays (6) and Sundays (0)
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        if (
          !schedules?.find(
            (item) => item?.date === currentDate.format(yearMonthDate)
          )
        )
          weekdays.push(currentDate);
        // else weekdays.push(currentDate);
      }
      currentDate = currentDate.add(1, "day");
    }

    return weekdays;
  }, [schedules]);

  useEffect(() => {
    if (!state.data) navigate("/tg/hr-registery/main");
  }, [state.data]);

  const handleSubmit = () => {
    if (!selectedTime) return warnToast("Выберите подходящее время!!!");
    else {
      const [hours, minutes] = selectedTime!.split(":").map(Number);
      const time_slot = selectedDate!
        .hour(hours)
        ?.minute(minutes)
        ?.second(0)
        ?.toISOString();
      mutate(
        {
          ...state.data,
          time_slot,
        },
        {
          onSuccess: (data) => {
            navigate(`/tg/hr-registery/success/${data.id}`, { state: data });
          },
          onError: (e: any) => {
            const detail = e?.response?.data?.detail;
            if (!!detail) timeRefetch();
            errorToast(detail ? detail : e.name + e.message);
          },
        }
      );
    }
  };

  return (
    <>
      <WebAppContainer className="pb-16">
        <h1 className="text-xl">Выберите время</h1>

        <p className="mt-2">День оформления</p>
        <div className="mt-1 grid gap-3 grid-cols-5">
          {!isLoading &&
            twoWeeks.map((item) => (
              <div
                key={item.toISOString()}
                onClick={() => $selectedDate(item)}
                className={cl(
                  {
                    ["!bg-[#46B72F] text-white"]:
                      selectedDate?.format("DD-MM") === item.format("DD-MM"),
                  },
                  "p-2 border transition-colors duration-300 border-[#D6D6D6] text-center text-xs sm:text-sm rounded bg-[#F6F6F6] hover:bg-[#E0E0E0] cursor-pointer"
                )}
              >
                {item.format("DD-MM")}
              </div>
            ))}
        </div>

        {!!selectedDate && (
          <>
            <p className="mt-4">Доступное время</p>

            <div
              key={selectedDate.toISOString()}
              className="grid grid-cols-3 gap-2 animate-fadeIn"
            >
              {timeSlots?.all?.map((item) => (
                <Flex
                  key={item}
                  flex={1}
                  justify="center"
                  onClick={() => handleSelectTime(item)}
                  className={cl(
                    { ["!bg-[#46B72F] text-white"]: selectedTime === item },
                    {
                      ["!bg-[#878787] text-white"]:
                        !!timeSlots?.reserved?.[item],
                    },
                    "border border-[#DFDFDF] rounded-xl py-1 px-4 transition-transform duration-300 hover:scale-105 cursor-pointer"
                  )}
                >
                  {item}
                </Flex>
              ))}
            </div>
          </>
        )}

        <div className="fixed bottom-0 left-0 right-0 p-2 bg-[#DFDFDF]">
          <Button
            disabled={isPending}
            onClick={handleSubmit}
            className="bg-[#3B21FF] h-10 rounded-full text-white w-full transition-transform duration-300 hover:scale-105"
          >
            Подтвердить
          </Button>
        </div>
      </WebAppContainer>
      <img
        src="/images/safia.jpg"
        alt="safia-logo"
        width={50}
        className="sticky bottom-16 opacity-25 left-1/2 -translate-x-1/2"
      />
    </>
  );
};

export default HRSelectTime;
