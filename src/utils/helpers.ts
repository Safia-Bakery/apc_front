import { QueryClient } from "@tanstack/react-query";
import {
  Departments,
  EPresetTimes,
  FileType,
  MainPermissions,
  MarketingSubDep,
  RequestStatus,
  SidebarType,
  Sphere,
} from "./types";
import useQueryString from "src/hooks/custom/useQueryString";

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
      case Departments.logystics:
        return "Запрос машин";
      case Departments.staff:
        return "Заявки на еду";
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
export const stockStores = {
  fabric: "f09c2c8d-00bb-4fa4-81b5-4f4e31995b86",
  retail: "4aafb5af-66c3-4419-af2d-72897f652019",
};

export const getValue = (obj: any, key: string) => {
  const keys = key.split(".");
  let value = obj;

  for (const k of keys) {
    if (!value) break;
    value = value[k];
  }

  return value;
};

export const staffCategoryId = 36;
// export const logysticsCategs = 37;

export const routes: SidebarType[] = [
  {
    name: "Тепловая карта",
    url: "/map",
    icon: "/assets/icons/map.svg",
    screen: MainPermissions.get_map,
  },
  {
    name: "АРС розница",
    icon: "/assets/icons/apc.svg",
    screen: MainPermissions.get_requests_apc,
    department: Departments.apc,
    sphere_status: Sphere.retail,
    subroutes: [
      {
        name: "Заявки на APC розница",
        url: "/requests-apc-retail",
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_requests_apc,
        param: `?sphere_status=${Sphere.retail}&addExp=${MainPermissions.request_add_expanditure}`,
      },
      {
        name: "Бригады",
        url: "/brigades",
        icon: "/assets/icons/brigades.svg",
        screen: MainPermissions.get_brigadas,
        param: `?sphere_status=${Sphere.retail}&add=${MainPermissions.add_brigada}&edit=${MainPermissions.edit_brigada}`,
      },
      {
        name: "Остатки на складах",
        url: "/items-in-stock",
        icon: "/assets/icons/remains-in-stock.svg",
        param: `/${stockStores.retail}`,
        screen: MainPermissions.get_warehouse_retail,
      },
      {
        name: "Категории",
        url: `/categories-apc-retail`,
        icon: "/assets/icons/categories.svg",
        screen: MainPermissions.get_apc_category,
      },
      {
        name: "Статистика",
        url: "/statistics-apc-retail",
        param: "/category",
        icon: "/assets/icons/statistics.svg",
        screen: MainPermissions.get_statistics,
      },
    ],
  },
  {
    name: "АРС фабрика",
    icon: "/assets/icons/apc.svg",
    screen: MainPermissions.get_fabric_requests,
    department: Departments.apc,
    sphere_status: Sphere.fabric,
    subroutes: [
      {
        name: "Заявки на APC фабрика",
        url: "/requests-apc-fabric",
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_fabric_requests,
        param: `?sphere_status=${Sphere.fabric}&addExp=${MainPermissions.add_expen_fab}`,
      },
      {
        name: "Мастера",
        url: "/masters",
        icon: "/assets/icons/brigades.svg",
        screen: MainPermissions.get_master,
        param: `?sphere_status=${Sphere.fabric}&add=${MainPermissions.add_master}&edit=${MainPermissions.edit_master}`,
      },
      {
        name: "Категории",
        url: `/categories-apc-fabric`,
        icon: "/assets/icons/categories.svg",
        screen: MainPermissions.get_categ_fab,
      },

      {
        name: "Остатки на складах",
        url: "/items-in-stock",
        icon: "/assets/icons/remains-in-stock.svg",
        param: `/${stockStores.fabric}`,
        screen: MainPermissions.get_warehouse_fabric,
      },
      {
        name: "Статистика",
        url: "/statistics-apc-fabric",
        icon: "/assets/icons/statistics.svg",
        param: "/category",
        screen: MainPermissions.get_statistics,
      },
    ],
  },

  {
    name: "IT",
    icon: "/assets/icons/it.svg",
    screen: MainPermissions.get_it_requests,
    department: Departments.it,
    subroutes: [
      {
        name: "Заявки",
        url: "/requests-it",
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_it_requests,
      },
      {
        name: "Мастера",
        url: "/masters-it",
        icon: "/assets/icons/brigades.svg",
        screen: MainPermissions.get_master,
        param: `?dep=${Departments.it}&add=${MainPermissions.it_add_master}&edit=${MainPermissions.it_edit_master}`,
      },
      {
        name: "Категории",
        url: `/categories-it`,
        icon: "/assets/icons/categories.svg",
        screen: MainPermissions.get_categ_fab,
      },

      {
        name: "Остатки на складах",
        url: "/items-in-stock-it",
        icon: "/assets/icons/remains-in-stock.svg",
        screen: MainPermissions.get_warehouse_fabric,
      },
      {
        name: "Статистика",
        url: "/statistics-it",
        icon: "/assets/icons/statistics.svg",
        // param: "/category",
        screen: MainPermissions.get_statistics,
      },
    ],
  },

  // {
  //   name: "Инвентарь",
  //   icon: "/assets/icons/inventary.svg",
  //   screen: MainPerm.,
  //   subroutes: [
  //     {
  //       name: "Заявки",
  //       url: "/requests-inventory",
  //       icon: "/assets/icons/subOrder.svg",
  //       screen: MainPerm.requests_inventory,
  //     },
  //   ],
  // },
  {
    name: "Маркетинг",
    icon: "/assets/icons/marketing.svg",
    screen: MainPermissions.get_design_request,
    department: Departments.marketing,
    subroutes: [
      {
        name: "Проектная работа для дизайнеров",
        url: `/marketing-${MarketingSubDep[1]}`,
        icon: "/assets/icons/subOrder.svg",
        param: `?add=${MainPermissions.add_design_request}&edit=${MainPermissions.edit_design_request}&title=Проектная работа для дизайнеров&sub_id=${MarketingSubDep.designers}`,
        screen: MainPermissions.get_design_request,
      },
      {
        name: "Локальный маркетинг",
        url: `/marketing-${MarketingSubDep[2]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_locmar_requests,
        param: `?add=${MainPermissions.add_locmar_requests}&edit=${MainPermissions.edit_locmar_requests}&title=Локальный маркетинг&sub_id=${MarketingSubDep.local_marketing}`,
      },
      {
        name: "Промо-продукция",
        url: `/marketing-${MarketingSubDep[3]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_promo_requests,
        param: `?add=${MainPermissions.add_promo_requests}&edit=${MainPermissions.edit_promo_requests}&title=Промо-продукция&sub_id=${MarketingSubDep.promo_production}`,
      },
      {
        name: "POS-Материалы",
        url: `/marketing-${MarketingSubDep[4]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_pos_requests,
        param: `?add=${MainPermissions.add_pos_requests}&edit=${MainPermissions.edit_pos_requests}&title=POS-Материалы&sub_id=${MarketingSubDep.pos}`,
      },
      {
        name: "Комплекты",
        url: `/marketing-${MarketingSubDep[5]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_complect_requests,
        param: `?add=${MainPermissions.add_complect_requests}&edit=${MainPermissions.edit_complect_requests}&title=Комплекты&sub_id=${MarketingSubDep.complects}`,
      },
      {
        name: "Для Тер.Менеджеров",
        url: `/marketing-${MarketingSubDep[6]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_nostandard_requests,
        param: `?add=${MainPermissions.add_nostandard_requests}&edit=${MainPermissions.edit_nostandard_requests}&title=Для Тер.Менеджеров&sub_id=${MarketingSubDep.nonstandartAdv}`,
      },
      {
        name: "Внешний вид филиала",
        url: `/marketing-${MarketingSubDep[7]}`,
        icon: "/assets/icons/subOrder.svg",
        screen: MainPermissions.get_stock_env_requests,
        param: `?add=${MainPermissions.add_stock_env_requests}&edit=${MainPermissions.edit_stock_env_requests}&title=Внешний вид филиала&sub_id=${MarketingSubDep.branchEnv}`,
      },
      {
        name: "Категории",
        url: `/categories-marketing`,
        icon: "/assets/icons/categories.svg",
        screen: MainPermissions.get_mark_category,
      },
      {
        name: "Статистика",
        url: "/statistics-marketing/department",
        icon: "/assets/icons/statistics.svg",
        screen: MainPermissions.get_statistics,
      },
    ],
  },
  {
    name: "Запрос машин",
    icon: "/assets/icons/logystics.svg",
    screen: MainPermissions.get_log_requests,
    department: Departments.logystics,
    subroutes: [
      {
        name: "Заявки на Запрос машин",
        url: "/requests-logystics",
        icon: "/assets/icons/logystics.svg",
        screen: MainPermissions.get_log_requests,
      },
      {
        name: "Категории",
        url: `/categories-logystics`,
        icon: "/assets/icons/categories.svg",
        screen: MainPermissions.get_log_categs,
      },
    ],
  },
  {
    name: "Заявки на еду",
    url: "/requests-staff",
    icon: "/assets/icons/staff.svg",
    screen: MainPermissions.get_staff_requests,
    department: Departments.staff,
  },
  {
    name: "Пользователи",
    url: "/users",
    icon: "/assets/icons/users.svg",
    screen: MainPermissions.get_users,
  },
  {
    name: "Клиенты",
    url: "/clients",
    icon: "/assets/icons/clients.svg",
    screen: MainPermissions.get_clients,
    param: "?client=true",
  },
  {
    name: "Роли",
    url: "/roles",
    icon: "/assets/icons/roles.svg",
    screen: MainPermissions.get_roles,
  },
  {
    name: "Отзывы",
    url: "/comments",
    icon: "/assets/icons/comments.svg",
    screen: MainPermissions.get_comments_list,
  },
  {
    name: "Настройки",
    icon: "/assets/icons/settings.svg",
    screen: MainPermissions.get_fillials_list,
    subroutes: [
      {
        name: "Филиалы",
        url: "/branches",
        icon: "/assets/icons/branch.svg",
        screen: MainPermissions.get_fillials_list,
      },
    ],
  },
];
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
