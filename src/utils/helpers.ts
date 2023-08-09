import { QueryClient } from "@tanstack/react-query";
import { EPresetTimes, FileType, RequestStatus, Screens } from "./types";

export const itemsPerPage = 50;

export const StatusName = [
  { name: "Активный", id: 1 },
  { name: "Не активный", id: 0 },
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
      cacheTime: EPresetTimes.MINUTE * 10,
      staleTime: EPresetTimes.MINUTE * 5,
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
  { id: RequestStatus.confirmed, name: "Принят" },
  { id: RequestStatus.new, name: "Новый" },
  { id: RequestStatus.sendToRepair, name: "Отправлен для ремонта" },
  { id: RequestStatus.done, name: "Закончен" },
  { id: RequestStatus.rejected, name: "Отклонён" },
];

export const requestRows = (status: RequestStatus) => {
  switch (status) {
    case RequestStatus.done:
      return "table-success";
    case RequestStatus.confirmed:
      return "table-primary";
    case RequestStatus.new:
      return "";
    case RequestStatus.rejected:
      return "table-danger";
    case RequestStatus.sendToRepair:
      return "table-warning";
    default:
      return "table-info";
  }
};
export const detectFileType = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase();
  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "HEIC",
    "IMG",
    "TIFF",
  ];
  const videoExtensions = ["mp4", "avi", "mkv", "mov", "webm"];

  if (extension && imageExtensions.includes(extension)) {
    return FileType.photo;
  } else if (extension && videoExtensions.includes(extension)) {
    return FileType.video;
  } else {
    return FileType.other;
  }
};

export const departments = [
  { id: 1, name: "APC" },
  { id: 2, name: "Инвентарь" },
  // { id: 3, name: "IT" },
];
export const permissioms = Object.keys(Screens).reduce((acc: any, key) => {
  acc[key] = true;
  return acc;
}, {});
