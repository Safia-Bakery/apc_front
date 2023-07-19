import { QueryClient } from "@tanstack/react-query";
import { EPresetTimes, RequestStatus } from "./types";

export const itemsPerPage = 20;

export const StatusName = [
  { name: "Активный", id: 0 },
  { name: "Не активный", id: 2 },
];
export const OrderTypeNames = [
  { name: "APC", id: "APC" },
  { name: "IT", id: "IT" },
];
export const UrgentNames = [
  { name: "Срочный", id: 1 },
  { name: "Несрочный", id: 2 },
];
export const RegionNames = [
  { name: "Uzbekistan", id: "Uzbekistan" },
  { name: "Kazakhstan", id: "Kazakhstan" },
];
export const CancelReason = [
  { name: "Do not needed", id: 1 },
  { name: "Exidently", id: 2 },
  { name: "Other", id: 3 },
];

export const numberWithCommas = (val: number) => {
  return val
    ?.toFixed(2)
    ?.toString()
    ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const fixedString = (value: string) => {
  return value
    .split("")
    .filter((item) => {
      return [" ", "-", "(", ")"].indexOf(item) === -1;
    })
    .join("");
};

export const getKeyByValue = (object: any, value: any) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: EPresetTimes.HOUR,
      staleTime: EPresetTimes.MINUTE * 30,
    },
  },
});

export const handleStatus = (status: RequestStatus | undefined) => {
  switch (status) {
    case RequestStatus.confirmed:
      return "Принят";
    case RequestStatus.done:
      return "Закончен";
    case RequestStatus.sendToRepair:
      return "Отправлен для ремонта";
    case RequestStatus.rejected:
      return "Отклонён";

    default:
      return "Новый";
  }
};

export const RequestStatusArr = [
  { id: RequestStatus.confirmed, name: RequestStatus["1"] },
  { id: RequestStatus.new, name: RequestStatus["0"] },
  { id: RequestStatus.sendToRepair, name: RequestStatus["2"] },
  { id: RequestStatus.done, name: RequestStatus["3"] },
  { id: RequestStatus.rejected, name: RequestStatus["4"] },
];
