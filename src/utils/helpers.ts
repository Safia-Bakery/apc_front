import { QueryClient } from "@tanstack/react-query";
import {
  Departments,
  EPresetTimes,
  FileType,
  MarketingSubDep,
  RequestStatus,
} from "./types";

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

export const handleStatus = (
  status: RequestStatus | undefined,
  isMarketing?: boolean
) => {
  switch (status) {
    case RequestStatus.confirmed:
      return "Принят";
    case RequestStatus.done:
      return "Закончен";
    case RequestStatus.sendToRepair:
      return isMarketing ? "Отправлен заказчику" : "Отправлен для ремонта";
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

export const RequestMarkStatusArr = [
  { id: RequestStatus.confirmed, name: "Принят" },
  { id: RequestStatus.new, name: "Новый" },
  { id: RequestStatus.sendToRepair, name: "Отправлен заказчику" },
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

export const isMobile = window.innerWidth <= 1200;

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

      default:
        break;
    }
};
export const stockStores = {
  fabric: "f09c2c8d-00bb-4fa4-81b5-4f4e31995b86",
  retail: "4aafb5af-66c3-4419-af2d-72897f652019",
};
