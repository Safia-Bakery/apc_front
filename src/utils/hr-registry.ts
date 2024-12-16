import dayjs, { Dayjs } from "dayjs";

export const workerFunction = [
  {
    value: 1,
    label: "Проходит стажировку для другого",
  },
  {
    value: 2,
    label: "Будет работать на указаном филиале",
  },
];

export const disabledDate = (current: Dayjs) => {
  const today = dayjs().startOf("day");
  const twoWeeksFromNow = today.add(14, "day");

  // Disable if the date is before today, after 14 days, or if it's a Saturday (6) or Sunday (0)
  const isWeekend = current.day() === 0 || current.day() === 6;

  return (
    current.isBefore(today) || current.isAfter(twoWeeksFromNow) || isWeekend
  );
};
