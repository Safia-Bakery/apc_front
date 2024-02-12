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
  { name: "Активный", id: 1 },
  { name: "Не активный", id: 0 },
];
export const OrderTypeNames = [
  { name: "АРС", id: "АРС" },
  { name: "IT", id: "IT" },
];
export const UrgentNames = [
  { name: "Срочный", id: 1 },
  { name: "Несрочный", id: 0 },
];
export const RegionNames = [
  { name: "Uzbekistan", id: "Uzbekistan" },
  { name: "Kazakhstan", id: "Kazakhstan" },
];
type CancelReasonType = {
  [key: number]: string;
};
export const CancelReason: CancelReasonType = {
  1: "Не правильная заявка",
  2: "Повторная заявка",
  3: "Тестовая заявка",
  4: "Другое",
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
      refetchOnReconnect: true,
      refetchOnMount: true,
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
      if (dep === Departments.logystics) return "Принят в работу";
      else return "Принят";
    }
    case RequestStatus.done:
      return "Закончен";
    case RequestStatus.sendToRepair: {
      if (dep === Departments.logystics) return "В пути";
      if (dep === Departments.marketing) return "Отправлен заказчику";
      else return "Отправлен для ремонта";
    }
    case RequestStatus.rejected:
      return "Отклонён";

    default:
      return "Новый";
  }
};

export const RequestStatusArr = [
  { id: RequestStatus.new, name: "Новый" },
  { id: RequestStatus.confirmed, name: "Принят" },
  { id: RequestStatus.sendToRepair, name: "Отправлен для ремонта" },
  { id: RequestStatus.done, name: "Закончен" },
  { id: RequestStatus.rejected, name: "Отклонён" },
];

export const RatingFilterVals = [{ id: 1, name: "Фильтровать" }];

export const RequestMarkStatusArr = [
  { id: RequestStatus.new, name: "Новый" },
  { id: RequestStatus.confirmed, name: "Принят" },
  { id: RequestStatus.sendToRepair, name: "Отправлен заказчику" },
  { id: RequestStatus.done, name: "Закончен" },
  { id: RequestStatus.rejected, name: "Отклонён" },
];

export const RequestLogStatusArr = [
  { id: RequestStatus.new, name: "Новый" },
  { id: RequestStatus.confirmed, name: "Принят в работу" },
  { id: RequestStatus.sendToRepair, name: "В пути" },
  { id: RequestStatus.done, name: "Закончен" },
  { id: RequestStatus.rejected, name: "Отклонён" },
];
export const SystemArr = [
  { id: 0, name: "Веб-сайт" },
  { id: 1, name: "Телеграм-бот" },
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
        return "Инвентарь";
      case Departments.marketing:
        return "Маркетинг";
      case Departments.it:
        return "IT";
      case Departments.logystics:
        return "Запрос машин";
      case Departments.staff:
        return "Заявки на еду";
      case Departments.cctv:
        return "Видеонаблюдение";
      default:
        break;
    }
  else
    switch (sub) {
      case MarketingSubDep.designers:
        return "Проектная работа для дизайнеров";
      case MarketingSubDep.complects:
        return "Комплекты";
      case MarketingSubDep.local_marketing:
        return "Локальный маркетинг";
      case MarketingSubDep.promo_production:
        return "Промо-продукция";
      case MarketingSubDep.pos:
        return "POS-Материалы";
      case MarketingSubDep.branchEnv:
        return "Внешний вид филиала";
      case MarketingSubDep.nonstandartAdv:
        return "Для Тер.Менеджеров";

      default:
        break;
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
      return "Новый";
    case RequestStatus.confirmed:
      return "Отвечен";
    case RequestStatus.rejected:
      return "Отклонён";

    default:
      break;
  }
};
