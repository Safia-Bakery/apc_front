import dayjs, { Dayjs } from "dayjs";
import { RequestStatus } from "./types";

export enum WorkerFunction {
  intern = "intern",
  works_in_selected_branch = "works_in_selected_branch",
}

export const workerFunction = [
  {
    value: WorkerFunction.intern,
    label: "Проходит стажировку для другого",
  },
  {
    value: WorkerFunction.works_in_selected_branch,
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

export const titleObj: { [key: number]: string } = {
  [RequestStatus.closed_denied]: "Отклонен",
  [RequestStatus.denied]: "Не оформлен",
  [RequestStatus.new]: "Запланировано",
  [RequestStatus.received]: "Запланировано",
  [RequestStatus.finished]: "Оформлено",
};
