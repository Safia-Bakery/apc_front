import { QueryClient } from "@tanstack/react-query";
import {
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
      if (dep === Departments.logystics) return "received_for_work";
      else return "received";
    }
    case RequestStatus.done:
      return "finished";
    case RequestStatus.sendToRepair: {
      if (dep === Departments.logystics) return "in_the_way";
      if (dep === Departments.marketing) return "sent_to_orderer";
      else return "sent_to_fix";
    }
    case RequestStatus.rejected:
      return "denied";
    case RequestStatus.paused:
      return "paused";
    case RequestStatus.solved:
      return "solved";

    default:
      return "new";
  }
};

export const RequestStatusArr = [
  { id: RequestStatus.new, name: "new" },
  { id: RequestStatus.confirmed, name: "received" },
  { id: RequestStatus.sendToRepair, name: "sent_to_fix" },
  { id: RequestStatus.done, name: "finished" },
  { id: RequestStatus.rejected, name: "denied" },
];

export const ITRequestStatusArr = [
  { id: RequestStatus.new, name: "new" },
  { id: RequestStatus.confirmed, name: "received" },
  { id: RequestStatus.solved, name: "solved" },
  { id: RequestStatus.rejected, name: "denied" },
  { id: RequestStatus.paused, name: "paused" },
  { id: RequestStatus.done, name: "finished" },
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
  { id: RequestStatus.new, name: "new" },
  { id: RequestStatus.confirmed, name: "received_for_work" },
  { id: RequestStatus.sendToRepair, name: "in_the_way" },
  { id: RequestStatus.done, name: "finished" },
  { id: RequestStatus.rejected, name: "denied" },
];
export const SystemArr = [
  { id: 0, name: "web_site" },
  { id: 1, name: "tg_bot" },
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
    case RequestStatus.paused:
      return "table-gray";
    case RequestStatus.solved:
      return "table-green";
    default:
      return "";
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
      case Departments.apc:
        return "АРС";
      case Departments.inventory:
        return "inventory";
      case Departments.marketing:
        return "marketing";
      case Departments.it:
        return "IT";
      case Departments.logystics:
        return "car_requests";
      case Departments.staff:
        return "request_for_food";
      case Departments.cctv:
        return "cctv";
      default:
        return "";
    }
  else
    switch (sub) {
      case MarketingSubDep.designers:
        return "project_works";
      case MarketingSubDep.complects:
        return "complects";
      case MarketingSubDep.local_marketing:
        return "local_marketingg";
      case MarketingSubDep.promo_production:
        return "promo_production";
      case MarketingSubDep.pos:
        return "pos";
      case MarketingSubDep.branchEnv:
        return "branch_env";
      case MarketingSubDep.nonstandartAdv:
        return "ter_manakgers";

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
  if (currentPage === 1) return index + 1;
  else return index + 1 + itemsPerPage * (currentPage - 1);
};

export const handleHRStatus = (dep: RequestStatus) => {
  switch (dep) {
    case RequestStatus.new:
      return "new";
    case RequestStatus.confirmed:
      return "answered";
    case RequestStatus.rejected:
      return "denied";

    default:
      break;
  }
};
