import { QueryClient } from "@tanstack/react-query";
import { EPresetTimes, StatusRoles } from "./types";

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

export const handleStatus = (status: StatusRoles) => {
  switch (status) {
    case StatusRoles.accountant:
      return "Бухгалтерия";
    case StatusRoles.fin:
      return "Финансовый отдел";
    case StatusRoles.purchasing:
      return "Отдел закупа";
    case StatusRoles.musa:
      return "Руководитель отдела закупа";
    case StatusRoles.shakhzod:
      return "Директор производства";
    case StatusRoles.begzod:
      return "Директор розницы";
    case StatusRoles.paid:
      return "Оплачен";
    case StatusRoles.denied:
      return "Отказан";

    default:
      return "Роль не выбран";
  }
};

export const rowColor = (status: StatusRoles) => {
  switch (status) {
    case StatusRoles.paid:
      return "table-success";
    case StatusRoles.denied:
      return "table-danger";

    default:
      return "table-info";
  }
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
