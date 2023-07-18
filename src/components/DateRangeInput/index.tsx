import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import cl from "classnames";

interface DateInputProps {
  onDateRangeSelected: (startDate: Date | null, endDate: Date | null) => void;
  register?: Object;
  blockClass?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  onDateRangeSelected,
  register,
  blockClass,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onDateRangeSelected(start, end);
  };

  return (
    <div className={cl("form-group", blockClass)}>
      <DatePicker
        selected={startDate}
        onChange={onChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        className="form-control"
        {...register}
      />
    </div>
  );
};

export default DateInput;
