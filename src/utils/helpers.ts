import { QueryClient } from "@tanstack/react-query";
import { BaseObjType, EPresetTimes, FileType, RequestStatus } from "./types";
import useQueryString from "custom/useQueryString";

export const itemsPerPage = 50;

export const StatusName = [
  { name: "active", id: 1 },
  { name: "not_active", id: 0 },
];
export const OrderTypeNames = [
  { name: "АРС", id: "АРС" },
  { name: "IT", id: "IT" },
];
export const UrgentNames = [
  { name: "urgentt", id: 1 },
  { name: "not_urgent", id: 0 },
];
export const RegionNames = [
  { name: "Uzbekistan", id: "Uzbekistan" },
  { name: "Kazakhstan", id: "Kazakhstan" },
];
type CancelReasonType = {
  [key: number]: string;
};
export const CancelReason: CancelReasonType = {
  1: "incorrect_request",
  2: "re_application",
  3: "test_request",
  4: "other",
};

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
      return [" ", "-", "(", ")", "_"].indexOf(item) === -1;
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
      gcTime: EPresetTimes.MINUTE * 10,
      staleTime: EPresetTimes.SECOND * 10,
    },
  },
});

export const MarketingStatusObj: any = {
  ...RequestStatus,
  ...{ [RequestStatus.sent_to_fix]: "sent_to_orderer" },
};

export const LogyticsStatusObj: any = {
  ...RequestStatus,
  ...{ [RequestStatus.sent_to_fix]: "in_the_way" },
  ...{ [RequestStatus.received]: "received_for_work" },
};

export const RequestStatusArr = [
  { value: RequestStatus.new, label: "Новый" },
  { value: RequestStatus.received, label: "Принят" },
  { value: RequestStatus.sent_to_fix, label: "Отправлен для ремонта" },
  { value: RequestStatus.finished, label: "Закончен" },
  { value: RequestStatus.closed_denied, label: "Отклонен" },
];

export const ITRequestStatusArr = [
  { value: RequestStatus.new, label: "Новый" },
  { value: RequestStatus.received, label: "Принятые" },
  { value: RequestStatus.solved, label: "Решен" },
  { value: RequestStatus.denied, label: "Отклонен" },
  { value: RequestStatus.paused, label: "Остановлен" },
  { value: RequestStatus.finished, label: "Закончен" },
  { value: RequestStatus.resumed, label: "Переоткрыт" },
  { value: RequestStatus.closed_denied, label: "Закрыт, отменен" },
];

export const UrgentValsArr = [
  { id: 0, name: "no" },
  { id: 1, name: "yes" },
];

export const RatingFilterVals = [{ id: 1, name: "to_filter" }];

export const RequestMarkStatusArr = [
  { value: RequestStatus.new, label: "Новый" },
  { value: RequestStatus.received, label: "Принятые" },
  { value: RequestStatus.sent_to_fix, label: "Отправлен заказчику" },
  { value: RequestStatus.finished, label: "Закончен" },
  { value: RequestStatus.closed_denied, label: "Закончен" },
];

export const RequestLogStatusArr = [
  { value: RequestStatus.new, label: "Новый" },
  { value: RequestStatus.received, label: "Принят в работу" },
  { value: RequestStatus.sent_to_fix, label: "В пути" },
  { value: RequestStatus.finished, label: "Закончен" },
  { value: RequestStatus.closed_denied, label: "Отклонен" },
];
export const SystemArr = [
  { id: 0, name: "web_site" },
  { id: 1, name: "tg_bot" },
];
export const requestRows: BaseObjType = {
  [RequestStatus.finished]: "table-success",
  [RequestStatus.received]: "table-primary",
  [RequestStatus.new]: "",
  [RequestStatus.closed_denied]: "table-danger",
  [RequestStatus.sent_to_fix]: "table-warning",
  [RequestStatus.paused]: "table-gray",
  [RequestStatus.solved]: "table-green",
  [RequestStatus.denied]: "table-waiting",
  [RequestStatus.resumed]: "table-warning",
};
type ObjBoolean = { [key: string]: boolean };
export const detectFileType = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase();
  const imageExtensions: ObjBoolean = {
    jpg: true,
    jpeg: true,
    png: true,
    gif: true,
    bmp: true,
    heic: true,
    img: true,
    tiff: true,
    svg: true,
  };
  const videoExtensions: ObjBoolean = {
    mp4: true,
    avi: true,
    mkv: true,
    mov: true,
    webm: true,
  };

  if (extension && imageExtensions[extension]) {
    return FileType.photo;
  } else if (extension && videoExtensions[extension]) {
    return FileType.video;
  } else {
    return FileType.other;
  }
};

export const isMobile = window.innerWidth <= 960;

export enum HRRequestTypes {
  offers = 3,
  objections = 2,
  asked_questions = 1,
}

export const isValidHttpUrl = (string: string) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

export const imageConverter = (img: File) =>
  img?.size ? URL.createObjectURL(img) : "";

export const handleIdx = (index: number) => {
  const currentPage = Number(useQueryString("page")) || 1;
  return currentPage === 1
    ? index + 1
    : index + 1 + itemsPerPage * (currentPage - 1);
};

export const handleHRStatus: BaseObjType = {
  [RequestStatus.new]: "new",
  [RequestStatus.received]: "answered",
  [RequestStatus.closed_denied]: "denied",
};
