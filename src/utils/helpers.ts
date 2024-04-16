import { QueryClient } from "@tanstack/react-query";
import {
  BaseObjType,
  Departments,
  EPresetTimes,
  FileType,
  MarketingSubDep,
  RequestStatus,
} from "./types";
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
      // refetchOnReconnect: true,
    },
  },
});

export const handleStatus = ({
  status,
  dep,
}: {
  status: RequestStatus | undefined;
  dep?: Departments;
}) => {
  switch (status) {
    case RequestStatus.confirmed: {
      if (dep === Departments.car_requests) return "received_for_work";
      else return "received";
    }
    case RequestStatus.done:
      return "finished";
    case RequestStatus.sendToRepair: {
      if (dep === Departments.car_requests) return "in_the_way";
      if (dep === Departments.marketing) return "sent_to_orderer";
      else return "sent_to_fix";
    }
    case RequestStatus.rejected:
      return "closed_denied";
    case RequestStatus.paused:
      return "paused";
    case RequestStatus.solved:
      return "solved";
    case RequestStatus.reopened:
      return "resumed";
    case RequestStatus.rejected_wating_confirmation:
      return "denied";

    default:
      return "new";
  }
};

export const RequestStatusArr = [
  { value: RequestStatus.new, label: "Новый" },
  { value: RequestStatus.confirmed, label: "Принят" },
  { value: RequestStatus.sendToRepair, label: "Отправлен для ремонта" },
  { value: RequestStatus.done, label: "Закончен" },
  { value: RequestStatus.rejected, label: "Отклонен" },
];

export const ITRequestStatusArr = [
  { value: RequestStatus.new, label: "Новый" },
  { value: RequestStatus.confirmed, label: "Принятые" },
  { value: RequestStatus.solved, label: "Решен" },
  { value: RequestStatus.rejected_wating_confirmation, label: "Отклонен" },
  { value: RequestStatus.paused, label: "Остановлен" },
  { value: RequestStatus.done, label: "Закончен" },
  { value: RequestStatus.reopened, label: "Переоткрыт" },
  { value: RequestStatus.rejected, label: "Закрыт, отменен" },
];

export const UrgentValsArr = [
  { id: 0, name: "no" },
  { id: 1, name: "yes" },
];

export const RatingFilterVals = [{ id: 1, name: "to_filter" }];

export const RequestMarkStatusArr = [
  { id: RequestStatus.new, name: "new" },
  { id: RequestStatus.confirmed, name: "received" },
  { id: RequestStatus.sendToRepair, name: "sent_to_orderer" },
  { id: RequestStatus.done, name: "finished" },
  { id: RequestStatus.rejected, name: "denied" },
];

export const RequestLogStatusArr = [
  { value: RequestStatus.new, label: "Новый" },
  { value: RequestStatus.confirmed, label: "Принят в работу" },
  { value: RequestStatus.sendToRepair, label: "В пути" },
  { value: RequestStatus.done, label: "Закончен" },
  { value: RequestStatus.rejected, label: "Отклонен" },
];
export const SystemArr = [
  { id: 0, name: "web_site" },
  { id: 1, name: "tg_bot" },
];
export const requestRows: BaseObjType = {
  [RequestStatus.done]: "table-success",
  [RequestStatus.confirmed]: "table-primary",
  [RequestStatus.new]: "",
  [RequestStatus.rejected]: "table-danger",
  [RequestStatus.sendToRepair]: "table-warning",
  [RequestStatus.paused]: "table-gray",
  [RequestStatus.solved]: "table-green",
  [RequestStatus.rejected_wating_confirmation]: "table-waiting",
  [RequestStatus.reopened]: "table-warning",
};
export const detectFileType = (url: string) => {
  const extension = url.split(".").pop()?.toLowerCase();
  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "heic",
    "img",
    "tiff",
    "svg",
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

export const isMobile = window.innerWidth <= 960;

export const handleDepartment = ({
  dep,
  sub,
}: {
  dep?: Departments | undefined;
  sub?: MarketingSubDep;
}) => {
  if (dep)
    switch (dep) {
      case Departments.APC:
        return "АРС";
      case Departments.inventory:
        return "inventory";
      case Departments.marketing:
        return "marketing";
      case Departments.IT:
        return "IT";
      case Departments.car_requests:
        return "car_requests";
      case Departments.request_for_food:
        return "request_for_food";
      case Departments.cctv:
        return "cctv";
      default:
        return "";
    }
  else
    switch (sub) {
      case MarketingSubDep.designers:
        return "designers";
      case MarketingSubDep.complects:
        return "complects";
      case MarketingSubDep.local_marketing:
        return "local_marketingg";
      case MarketingSubDep.promo_production:
        return "promo_production";
      case MarketingSubDep.pos:
        return "pos";
      case MarketingSubDep.branch_env:
        return "branch_env";
      case MarketingSubDep.ter_managers:
        return "ter_managers";

      default:
        return "";
    }
};

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

export const imageConverter = (img: File) => {
  if (img?.size) return URL.createObjectURL(img);
  return "";
};

export const handleIdx = (index: number) => {
  const currentPage = Number(useQueryString("page")) || 1;
  return currentPage === 1
    ? index + 1
    : index + 1 + itemsPerPage * (currentPage - 1);
};

export const handleHRStatus: BaseObjType = {
  [RequestStatus.new]: "new",
  [RequestStatus.confirmed]: "answered",
  [RequestStatus.rejected]: "denied",
};
