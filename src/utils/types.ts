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
  value: number;
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

export enum MainPermissions {
  edit_roles = 2,
  get_roles = 14,
  add_role = 15,
  get_comments_list = 1,
  edit_comment = 13,
  get_brigadas = 3,
  add_brigada = 16,
  edit_brigada = 17,
  get_warehouse_retail = 4,
  get_warehouse_fabric = 70,
  get_users = 5,
  add_users = 18,
  edit_users = 19,
  get_mark_category = 6,
  add_mark_category = 20,
  edit_mark_category = 21,
  get_map = 8,
  synch_fillials_iiko = 9,
  synch_tools_iiko = 30,
  add_fillials = 22,
  edit_fillials = 23,
  get_fillials_list = 29,
  get_requests_apc = 12,
  edit_request_apc = 24,
  add_request_apc = 25,
  synch_apc_iiko = 26,
  request_ettach = 27,
  request_add_expanditure = 28,
  get_design_request = 31,
  add_design_request = 44,
  edit_design_request = 32,
  get_locmar_requests = 33,
  add_locmar_requests = 45,
  edit_locmar_requests = 34,
  get_promo_requests = 35,
  add_promo_requests = 43,
  edit_promo_requests = 36,
  get_pos_requests = 37,
  add_pos_requests = 42,
  edit_pos_requests = 38,
  get_complect_requests = 39,
  add_complect_requests = 41,
  edit_complect_requests = 40,
  get_apc_category = 48,
  add_apc_category = 46,
  edit_apc_category = 47,

  get_clients = 58,
  add_clients = 59,
  edit_clients = 60,

  get_master = 61,
  add_master = 62,
  edit_master = 63,

  get_fabric_requests = 49,
  edit_fabric_requests = 50,
  add_fabric_requests = 51,
  sync_fab_req_iiko = 52,
  fabric_req_attach_master = 53,
  add_expen_fab = 54,
  add_categ_fab = 55,
  get_categ_fab = 57,
  edit_categ_fab = 56,

  get_stock_env_requests = 67,
  edit_stock_env_requests = 68,
  add_stock_env_requests = 69,

  get_nostandard_requests = 64,
  edit_nostandard_requests = 65,
  add_nostandard_requests = 66,

  get_log_requests = 71,
  edit_log_requests = 73,
  add_log_requests = 72,

  get_log_cars = 92,
  add_log_cars = 93,
  edit_log_cars = 94,

  get_log_categs = 74,
  add_log_categs = 75,
  edit_log_categs = 76,

  get_staff_requests = 80,
  add_staff_requests = 79,
  edit_staff_requests = 78,
  staff_modal_time = 77,

  it_add_master = 84,
  it_edit_master = 83,
  it_get_masters = 85,
  it_statistics = 81,
  it_remains_in_stock = 83,
  get_it_requests = 90,
  edit_it_requests = 89,
  add_it_requests = 91,
  add_categ_it = 87,
  get_categ_it = 88,
  edit_categ_it = 86,

  get_client_comment = 95,
  edit_client_comment = 97,
  add_client_comment = 96,

  get_requests_inventory = 98,
  add_requests_inventory = 99,
  edit_requests_inventory = 100,
  edit_product_inventory = 102,
  get_product_inventory = 101,
  get_inventory_purchase_prods = 103,
  edit_inventory_purchase_prods = 104,
  inventory_remains_in_stock = 105,
  inventory_reports = 106,

  get_faq = 107,
  add_faq = 108,
  edit_faq = 109,
  get_faq_requests = 110,
  edit_faq_requests = 111,

  marketing_all_requests = 112,

  get_requests_cctv = 117,
  add_requests_cctv = 118,
  edit_requests_cctv = 115,
  edit_cetagories_cctv = 120,
  get_cetagories_cctv = 116,
  add_cetagories_cctv = 119,

  stats_apc_fabric = 114,

  stats_apc_retail = 113,
  stats_marketing = 7,

  get_apc_expenses = 121,
  edit_apc_expenses = 122,
  add_apc_expenses = 123,
  get_apc_expenses_categories = 121,
  add_apc_expenses_categories = 122,
  edit_apc_expenses_categories = 123,

  bot_settings = 124,

  get_tg_link = 125,
  edit_tg_link = 126,
  add_tg_link = 127,

  get_categories_inventory = 128,
  edit_categories_inventory = 129,
  add_categories_inventory = 130,

  get_form_request = 131,
  add_form_request = 133,
  edit_form_request = 132,

  get_form_category = 134,
  edit_form_category = 135,
  add_form_category = 136,
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
  inventory,
  marketing,
  IT,
  car_requests, // zakaz mawin
  request_for_food, // zakaz edi
  clientComment, // otziv clientov
  cctv, // videonablyudeniye
  form,
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
  image: string;
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

export interface InvServiceStatTypes {
  [key: string]: InvServiceStatType;
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
