import { MainPermissions } from "./permissions";

export enum EPresetTimes {
  SECOND = 1000,
  MINUTE = SECOND * 60,
  HOUR = MINUTE * 60,
  DAY = HOUR * 24,
  WEEK = DAY * 7,
  TEN_DAYS = DAY * 10,
}

export interface BasePaginatedResDeprecated {
  total: number;
  page: number;
  size: number;
  pages: number;
}

export type BasePaginateRes<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
};

export interface UserTypes {
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  group_id?: number;
  status?: number;
  password?: string;
  id?: number;
  brigader?: BrigadaType;
  telegram_id: number | null;
  sphere_status: number;
  group?: {
    name: string;
    id: number | string;
  };
}

export interface Order {
  product: string;
  description: string;
  size: string;
  price: number;
  id: number | string;
  created_at: Date;
  updated_at: Date;
  started_at: Date;
  deny_reason: string | null;
  pause_reason: string | null;
  status: number;
  urgent: boolean;
  user: UserTypes;
  user_manager: string;
  phone_number?: string;
  is_bot: boolean;
  request_orpr?: {
    id: number;
    amount: number;
    orpr_product: {
      id: number;
      category_id: number;
      name: string;
      status: number;
      description: string;
      image: string;
      prod_cat: { name: string; price?: number };
    };
  }[];
  brigada: {
    id: number | string;
    name: string;
    description?: string;
    status?: number;
    order?: string;
    is_outsource: boolean;
  };
  communication?: {
    id: number;
    message: string;
    status: number;
    photo?: string;
    user: UsersType;
    created_at: string;
  }[];
  file: {
    url: string;
    status: number;
  }[];
  category: Category;
  is_redirected?: boolean;
  is_expired?: boolean;
  location?: { from_loc: string; to_loc: string } | null;
  expanditure: {
    id: number;
    amount: number;
    comment: string;
    status: number;
    user: UserTypes;
    created_at: Date;
    tool: {
      code: string;
      id: number;
      mainunit: string;
      name: string;
      producttype: string;
      image?: string;
    };
  }[];
  fillial: {
    id: number | string;
    name: string;
    longtitude: number;
    origin: number;
    latitude: number;
    parentfillial: { name: string };
    country: string;
    status: number;
  };
  finished_at: Date;
  arrival_date: Date;
  bread_size?: string;
  update_time: { [key: number | string]: string };
  finishing_time?: Date;

  comments: [
    {
      id: 3;
      request: Order;
      user: UsersType;
      comment: string;
      rating: string;
    }
  ];
  cars?: CarsTypes;
}

export interface OrderType extends BasePaginatedResDeprecated {
  items: Order[];
}

export interface StockItem {
  name: string;
  amount_left: number;
  last_update: string;
  total_price: number;
}

export interface RemainsInStockType extends BasePaginatedResDeprecated {
  items: StockItem[];
}

export interface BranchType {
  id: string;
  name: string;
  longtitude: number | null;
  latitude: number | null;
  country: string;
  status: number;
  origin: number;
  fillial_department: BranchType[];
  is_fabrica: boolean;
}
export interface BranchTypes extends BasePaginatedResDeprecated {
  items: BranchType[];
}
export interface BrigadaType {
  id: number;
  name: string;
  description: string;
  status: number;
  topic_id: number;
  is_outsource: boolean;
  sphere_status: number;
  user?: {
    id: number | string;
    username: string;
    full_name: string;
    email: string;
    phone_number: string;
    group: {
      name: string;
      id: number | string;
    };
    status: number;
  }[];
}
export interface BrigadaTypes extends BasePaginatedResDeprecated {
  items: BrigadaType[];
}
export interface CreateOrderType {
  category_id: number;
  purchaser: string;
  product: string;
  seller: string;
  delivery_time: Date;
  price: number;
  payer: string;
  urgent: boolean;
  description: string;
  image_id?: string;
  payment_type: string;
}
export interface MeTypes {
  id: number | string;
  username: string;
  role?: { descrition: string; name: string };
  full_name: string;
  permissions: number[];
}
export enum Status {
  accepted = "accepted",
  denied = "denied",
}
export interface RoleTypes {
  status: number;
  name: string;
  id: number | string;
}

export interface TgLinkTypes {
  id?: number;
  name?: string;
  chat_id?: string;
}
export interface PermissionTypes {
  page_name: string;
  actions: {
    id: number;
    action_name: string;
  }[];
}

export interface RolePermissions {
  permissions: number[];
  pages: {
    page_name: string;
    id: number | string;
  }[];
  role_name: string;
  role_id: number;
}

export interface Category {
  name: string;
  department?: Departments;
  description: string;
  status: number;
  price: number;
  id: number;
  urgent: number;
  sub_id?: number;
  file: string;
  ftime: number;
  telegram_id?: number;
  parent_id?: number | null;
  is_child?: boolean | null;
}

export interface CategoryTypes extends BasePaginatedResDeprecated {
  items: Category[];
}

export interface CategoryProducts {
  id: number;
  category_id: number;
  name: string;
  status: number;
  image?: string;
  description?: string;
}

export interface ExpenditureType {
  id: number;
  created_at: string;
  request_id: number;
  amount: number;

  tool: ToolItemType;
  comment: string;
  user: UserTypes;
  status: number;
}
export interface ExpendituresTypes extends BasePaginatedResDeprecated {
  items: ExpenditureType[];
}

export interface DistinctTypes {
  tests: {
    amount: number;
    name: string;
    id: number;
    price?: number;
  }[];
}

export interface Comments {
  id: number;
  request: Order;
  user: UserTypes;
  comment: string;
  rating: number;
}

export interface CommentTypes extends BasePaginatedResDeprecated {
  items: Comments[];
}

export interface UsersType {
  username: string;
  id: number | string;
  full_name: string;
  email: string | null;
  phone_number: string | null;
  group: {
    name: string;
    id: number | string;
  } | null;
  status: number;
}

export interface UsersTypes extends BasePaginatedResDeprecated {
  items: UsersType[];
}

export interface ValueLabel {
  label: string;
  value: number | string;
}

export enum RequestStatus {
  new,
  received,
  sent_to_fix,
  finished,
  closed_denied,
  paused,
  solved,
  resumed,
  denied,
}
export type RequestFilter = {
  id?: number | string;
  department?: string;
  fillial_id?: string;
  category_id?: number;
  urgent?: string | null;
  created_at?: string;
  request_status?: string;
  user?: string;
  page?: number;
  size?: number;
};

export enum FileType {
  other = "other",
  video = "video",
  photo = "photo",
}

export type ToolItemType = {
  name: string;
  id: string;
  code: string;
  mainunit: string;
  producttype: string;
  iikoid: string;
  price: number;
  parentid: string;
  total_price: number;
  amount_left: number;
  min_amount: number | null;
  max_amount: number | null;
  ftime?: string | number;
  status: number;
  image?: string;
  category_id?: string | number;
  count: number;
  confirmation?: boolean;
  confirmer?: number;
};

export interface ToolTypes extends BasePaginatedResDeprecated {
  items: ToolItemType[];
}

export interface CartProducts {
  id: number;
  name: string;
  count: number;
  comment: string;
  author: { name: string; id: number | string };
}

export enum MarketingSubDep {
  all,
  designers,
  local_marketing,
  promo_production,
  pos,
  complects,
  ter_managers,
  branch_env,
}

export const MarketingSubDepRu = [
  {
    name: "Проектная работа для дизайнеров",
    id: MarketingSubDep.designers, // 1
  },
  {
    name: "Видеография / Фото",
    id: MarketingSubDep.local_marketing, // 2
  },
  {
    name: "Промо-продукция",
    id: MarketingSubDep.promo_production, // 3
  },
  {
    name: "POS-Материалы",
    id: MarketingSubDep.pos, // 4
  },
  {
    name: "Комплекты",
    id: MarketingSubDep.complects, // 5
  },
  {
    name: "Для Тер.Менеджеров",
    id: MarketingSubDep.ter_managers, // 6
  },
  {
    name: "Внешний вид филиала",
    id: MarketingSubDep.branch_env, // 7
  },
];
export enum Departments {
  all,
  APC,
  inventory_retail,
  marketing,
  IT,
  car_requests, // zakaz mawin
  request_for_food, // zakaz edi
  clientComment, // otziv clientov
  cctv, // videonablyudeniye
  form,
  inventory_factory,
}
export enum Sphere {
  retail = 1, //for APC department
  fabric = 2, //for APC department
  purchase = 3, //for it department
  fix = 4, //for it department
}
export interface CategoryStatTypes {
  success: boolean;
  piechart: {
    category_name: string;
    request_count: number;
    percentage: number;
  }[];
  table: {
    category: string;
    amount: number;
    time: number;
  }[];
}

export type BaseMarkObjType = {
  [key: string | number]: number[];
};

export type BaseObjType = {
  [key: string | number]: string;
};

export type BaseReturnBoolean = {
  [key: number]: boolean;
};
export interface MarketingDepartmentTypes {
  pie: BaseMarkObjType;
  table: BaseMarkObjType;
  tables: BaseMarkObjType;
}

export interface DepartmentStatTypes {
  name: string;
  amount: number;
  time: number;
}
export interface BrigadaCategStatTypes {
  [key: string]: (string | number)[][];
}
export interface BotWorkTimeType {
  from_time: string;
  to_time: string;
}

interface BaseSidebarTypes {
  name: string;
  icon: string;
  screen: MainPermissions;
  url?: string;
  param?: string;
  count?: number;
  department?: Departments;
  sphere_status?: Sphere;
}

export interface SidebarType extends BaseSidebarTypes {
  subroutes?: BaseSidebarTypes[];
}

export const enum ModalTypes {
  closed,
  cancelRequest,
  assign,
  showPhoto,
  assingDeadline,
  reassign,
  cars,
  changeBranch,
  changeCateg,
  leaveMessage,
  pause,
  expense,
}

export interface CountTypes {
  counter: [number[]];
  comment: string;
}

export interface CarsTypes {
  id: number;
  name: string;
  status: number;
  number: string;
}
export type InventoryTools = {
  id: number;
  code: string;
  producttype: string;
  parentid: string;
  total_price: string;
  sklad_id: string[];
  department: Departments;
  max_amount: string;
  name: string;
  num: string;
  iikoid: string;
  price: number;
  mainunit: string;
  amount_left: string;
  last_update: string;
  min_amount: string;
  image?: string;
  ftime?: number | null;
  status?: number;
  count: number;
};

export interface ToolsFolderType {
  num: string;
  code: string;
  parent_id: string;
  description: string;
  id: string;
  name: string;
  category: string;
}
export interface ToolsEarchType {
  folders: ToolsFolderType[];
  tools: InventoryTools[];
}

export interface InventoryOrders extends BasePaginatedResDeprecated {
  items: {
    id: number;
    status: number;
    user: {
      id: number;
      username: string;
      full_name: string;
      email: string;
      phone_number: string;
      group: {
        name: string;
        id: number;
      };
      status: number;
    };
    created_at: string;
    updated_at: string;
    order_need: [
      {
        id: number;
        status: number;
        need_tool: {
          id: number;
          name: string;
          code: string;
          mainunit: string;
          producttype: string;
          iikoid: string;
          price: number;
          parentid: string;
          total_price: number;
          amount_left: number;
          min_amount: number;
          max_amount: number;
        };
        ordered_amount: number;
        amount_last: number;
        toolorder_id: number;
        created_at: string;
        updated_at: string;
      }
    ];
  }[];
}

export interface InventoryOrder extends BasePaginatedResDeprecated {
  items: {
    id: number;
    status: number;
    need_tool: {
      id: number;
      name: string;
      code: string;
      mainunit: string;
      producttype: string;
      iikoid: string;
      price: number;
      parentid: string;
      total_price: number;
      amount_left: number;
      min_amount: number;
      max_amount: number;
    };
    ordered_amount: number;
    amount_last: number;
    toolorder_id: number;
    updated_at: string;
    created_at: string;
  }[];
}
export interface FAQTypes {
  id?: number;
  question?: string;
  answer?: string;
  status?: number;
}

export interface FAQRequestTypes {
  id: number;
  comments: string;
  status: number;
  created_at: string;
  sphere: number;
  answer: string;
}

export interface MainStatTypes {
  brage_requests: {
    [key: string]: number[];
  };
  new_requests: number;
  avg_rating: null | number;
  avg_time?: number; // in minutes
  total_requests: number;
  in_progress?: number;
  last_30?: number;
  last_month?: number;
}

export interface ServiceStatsType {
  total_requests: number;
  finished_on_time: number;
  not_finished_on_time: number;
  status_zero: number;
  percentage_finished_on_time: number;
  percentage_not_finished_on_time: number;
  percentage_status_zero: number;
  avg_finishing: number;
  category: string;
  category_id: number;
}

export interface ServiceStatsTypes {
  [key: number | string]: ServiceStatsType[];
}

export interface InvServiceStatType {
  total_tools: number;
  on_time_requests: number;
  not_finishedontime: number;
  not_even_started: number;
  not_finishedon_time_percent: number;
  on_time_requests_percent: number;
  not_started_percent: number;
  avg_finishing: number;
}

export interface InvRetailServiceStatTypes {
  [key: string]: InvServiceStatType;
}

export interface InvFactoryServiceStatTypes {
  service_level: { [key: string]: InvServiceStatType };
  service_efficiency: {
    avg_processing_time: number;
    category: string;
    total_requests: number;
  }[];
}

export interface ItServiceStatType {
  total_requests: number;
  finished_on_time: number;
  not_finished_on_time: number;
  status_zero: number;
  percentage_finished_on_time: number;
  percentage_not_finished_on_time: number;
  percentage_status_zero: number;
  avg_finishing: null | number;
  category: string;
}

export interface ItServiceStatTypes {
  [key: string]: ItServiceStatType;
}

export interface BaseExpenseTypes {
  amount: number;
  description: string;
  from_date: string;
  to_date: string;
  expensetype_id: number;
  status: number;
  created_at: string;
  id: number;
  expensetype: {
    name: string;
    status: number;
    created_at: string;
    id: number;
  };
}

export interface ExpensesTypes extends BasePaginatedResDeprecated {
  items: BaseExpenseTypes[];
}
export interface ExpenseCategoriesTypes {
  created_at: string;
  id: number;
  status: number;
  name: string;
}

export interface InventoryWebAppOrders {
  product: string;
  description: string;
  deny_reason: string;
  pause_reason: string;
  id: number;
  rating: number;
  created_at: string;
  status: number;
  brigada: BrigadaType;
  file: {
    url: string;
    status: number;
  }[];
  category: Category;
  fillial: BranchType;
  started_at: string;
  finished_at: string;
  user: UserTypes;
  user_manager: string;
  expanditure: ExpenditureType[];
  comments: Comments;
  is_bot: true;
  size: string;
  arrival_date: string;
  bread_size: string;
  update_time: {
    [key: number]: string;
  };
  finishing_time: string;
  is_redirected: true;
  old_cat_id: number;
  price: number;
}
