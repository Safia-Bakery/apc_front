export enum EPresetTimes {
  SECOND = 1000,
  MINUTE = SECOND * 60,
  HOUR = MINUTE * 60,
  DAY = HOUR * 24,
  WEEK = DAY * 7,
  TEN_DAYS = DAY * 10,
}

export interface BasePaginatedRes {
  total: number;
  page: number;
  size: number;
  pages: number;
}

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
  id: number | string;
  created_at: Date;
  started_at: Date;
  deny_reason: string | null;
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
  };
  communication?: {
    id: number;
    message: string;
    status: number;
    user: UsersType;
  }[];
  file: {
    url: string;
    status: number;
  }[];
  category: Category;
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
  finishing_time?: string;
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

export interface OrderType extends BasePaginatedRes {
  items: Order[];
}

export interface StockItem {
  name: string;
  amount_left: number;
  last_update: string;
  total_price: number;
}

export interface RemainsInStockType extends BasePaginatedRes {
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
export interface BranchTypes extends BasePaginatedRes {
  items: BranchType[];
}
export interface BrigadaType {
  id: number;
  name: string;
  description: string;
  status: number;
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
export interface BrigadaTypes extends BasePaginatedRes {
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
  id: number | string;
  urgent: number;
  sub_id?: number;
  file: string;
  ftime: number;
}

export interface CategoryTypes extends BasePaginatedRes {
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
}
export interface ExpendituresTypes extends BasePaginatedRes {
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

export interface CommentTypes extends BasePaginatedRes {
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

export interface UsersTypes extends BasePaginatedRes {
  items: UsersType[];
}

export interface ValueLabel {
  label: string;
  value: number;
}
export enum RequestStatus {
  new,
  confirmed,
  sendToRepair,
  done,
  rejected,
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

export interface ToolTypes extends BasePaginatedRes {
  items: {
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
  }[];
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
}
export enum MarketingSubDep {
  designers = 1,
  local_marketing = 2,
  promo_production = 3,
  pos = 4,
  complects = 5,
  nonstandartAdv = 6,
  branchEnv = 7,
}

export const MarketingSubDepRu = [
  {
    name: "Проектная работа для дизайнеров",
    id: MarketingSubDep.designers,
  },
  {
    name: "Локальный маркетинг",
    id: MarketingSubDep.local_marketing,
  },
  {
    name: "Промо-продукция",
    id: MarketingSubDep.promo_production,
  },
  {
    name: "POS-Материалы",
    id: MarketingSubDep.pos,
  },
  {
    name: "Комплекты",
    id: MarketingSubDep.complects,
  },
  {
    name: "Для Тер.Менеджеров",
    id: MarketingSubDep.nonstandartAdv,
  },
  {
    name: "Внешний вид филиала",
    id: MarketingSubDep.branchEnv,
  },
];
export enum Departments {
  all = 0,
  apc = 1,
  inventory = 2,
  marketing = 3,
  it = 4,
  logystics = 5, // zakaz mawin
  staff = 6, // zakaz edi
  clientComment = 7, // otziv clientov
  cctv = 8, // videonablyudeniye
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

export interface MarketingDepartmentTypes {
  pie: { [key: string]: number[] };
  table: { [key: string]: number[] };
  tables: { [key: string]: number[] };
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

export interface ToolsEarchType {
  folders: {
    num: string;
    code: string;
    parent_id: string;
    description: string;
    id: string;
    name: string;
    category: string;
  }[];
  tools: {
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
  }[];
}

export interface InventoryOrders extends BasePaginatedRes {
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

export interface InventoryOrder extends BasePaginatedRes {
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
export interface MainFAQTypes extends BasePaginatedRes {
  items: FAQTypes[];
}

export interface FAQRequestTypes extends BasePaginatedRes {
  items: {
    id: number;
    comments: string;
    status: number;
    created_at: string;
    sphere: number;
    answer: string;
  }[];
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
}

export interface ServiceStatsTypes {
  [key: number]: ServiceStatsType[];
}
