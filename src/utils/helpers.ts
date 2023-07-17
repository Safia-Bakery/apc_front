import { QueryClient } from "@tanstack/react-query";
import { EPresetTimes, RequestStatus } from "./types";

export const itemsPerPage = 20;

export const StatusName = [
  { name: "Активный", id: 1 },
  { name: "Не активный", id: 0 },
];
export const OrderTypeNames = [
  { name: "APC", id: 1 },
  { name: "IT", id: 0 },
];
export const UrgentNames = [
  { name: "Срочный", id: 1 },
  { name: "Несрочный", id: 0 },
];
export const RegionNames = [
  { name: "Uzbekistan", id: 1 },
  { name: "Kazakhstan", id: 2 },
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
    case RequestStatus.new:
      return "new";
    case RequestStatus.confirmed:
      return "confirmed";
    case RequestStatus.done:
      return "done";
    case RequestStatus.inProgress:
      return "inProgress";
    case RequestStatus.rejected:
      return "rejected";
    case RequestStatus.sendToRepair:
      return "sendToRepair";

    default:
      return "new";
  }
};
