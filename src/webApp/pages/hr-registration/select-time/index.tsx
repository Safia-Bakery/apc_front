import { getHrTimeSlots } from "@/hooks/hr-registration";
import { yearMonthDate } from "@/utils/keys";
import warnToast from "@/utils/warnToast";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { Button, Empty, Flex } from "antd";
import cl from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function getNextTwoWeeksWeekdays(): Dayjs[] {
  const weekdays: Dayjs[] = [];
  let currentDate: Dayjs = dayjs();
  const endDate: Dayjs = currentDate.add(1.9, "week");

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    const dayOfWeek = currentDate.day();
    // Exclude Saturdays (6) and Sundays (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      weekdays.push(currentDate);
    }
    currentDate = currentDate.add(1, "day");
  }

  return weekdays;
}

const HRSelectTime = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [selectedDate, $selectedDate] = useState<Dayjs>();
  const [selectedTime, $selectedTime] = useState<string>();
  const twoWeeks = getNextTwoWeeksWeekdays();

  const { data: timeSlots, isLoading: timeLoading } = getHrTimeSlots({
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

  return (
    <WebAppContainer className="pb-9">
      <h1 className="text-xl">Выберите время</h1>

      <p className="mt-2">День оформления</p>
      <div className="mt-1 grid gap-3 grid-cols-5">
        {twoWeeks.map((item) => (
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

          <div className="grid grid-cols-3 gap-2 animate-fadeIn">
            {timeSlots?.all?.map((item) => (
              <Flex
                key={item}
                flex={1}
                justify="center"
                onClick={() => handleSelectTime(item)}
                className={cl(
                  { ["!bg-[#46B72F] text-white"]: selectedTime === item },
                  {
                    ["!bg-[#878787] text-white"]: !!timeSlots?.reserved?.[item],
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

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-[#DFDFDF]">
        <Button className="bg-[#3B21FF] rounded-full text-white w-full transition-transform duration-300 hover:scale-105">
          Подтвердить
        </Button>
      </div>
    </WebAppContainer>
  );
};

export default HRSelectTime;
