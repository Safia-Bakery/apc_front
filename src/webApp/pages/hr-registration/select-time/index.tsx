import { disabledDate } from "@/utils/hr-registry";
import WebAppContainer from "@/webApp/components/WebAppContainer";
import { Flex } from "antd";
import cl from "classnames";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function getNextTwoWeeksWeekdays(): string[] {
  const weekdays: string[] = [];
  let currentDate: Dayjs = dayjs();
  const endDate: Dayjs = currentDate.add(2, "week");

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
    const dayOfWeek = currentDate.day();
    // Exclude Saturdays (6) and Sundays (0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      weekdays.push(currentDate.format("YYYY-MM-DD"));
    }
    currentDate = currentDate.add(1, "day");
  }

  return weekdays;
}

const HRSelectTime = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [selectedDate, $selectedDate] = useState();

  console.log(disabledDate(dayjs()), "seleele");
  console.log(state, "state");
  return (
    <WebAppContainer>
      <h1 className="text-xl">Мои заяки</h1>

      <p className="">День оформления</p>
      <Flex>
        <div className={cl("p-3")}></div>
      </Flex>
    </WebAppContainer>
  );
};

export default HRSelectTime;
