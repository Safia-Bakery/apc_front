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

export interface RoleList {
  success: boolean;
  listroles: {
    musa: "Руководитель отдела закупа";
    shakhzod: "Директор производства";
    begzod: "Директор розницы";
    fin: "Финансовый отдел";
    accountant: "Бухгалтерия";
    unconfirmed: "Роль не выбран";
    purchasing: "Отдел закупа";
  }[];
}

export interface UserTypes {
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  group_id?: number;
  status: number;
  password?: string;
  id?: number;
  group?: {
    name: string;
    id: number;
  };
}

export interface Order {
  product: string;
  description: string;
  id: number;
  rating: number;
  created_at: Date;
  status: number;
  urgent: boolean;
  brigada: {
    id: number;
    name: string;
    description: string;
    status: number;
  };
  file: {
    url: string;
  }[];
  category: {
    name: string;
    description: string;
    status: number;
    id: number;
  };
  fillial: {
    id: number;
    name: string;
    longtitude: number;
    latitude: number;
    country: string;
    status: number;
  };
  finished_at: Date;
}

export interface OrderType extends BasePaginatedRes {
  items: Order[];
}

export interface BranchType {
  id: number;
  name: string;
  longtitude: number;
  latitude: number;
  country: string;
  status: number;
}
export interface BranchTypes extends BasePaginatedRes {
  items: BranchType[];
}
export interface BrigadaType {
  id: number;
  name: string;
  description: string;
  status: number;
  user?: {
    username: string;
    full_name: string;
    email: string;
    phone_number: string;
    group: {
      name: string;
      id: number;
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

export interface BoolObj {
  [key: string]: boolean;
}
export interface MeTypes {
  id: number;
  username: string;
  role?: { descrition: string; name: string };
  full_name: string;
  permissions: BoolObj | "*";
}
export enum Status {
  accepted = "accepted",
  denied = "denied",
}
export interface RoleTypes {
  status: number;
  name: string;
  id: number;
}
export interface PermissionTypes {
  page_name: string;
  id: number;
}

export interface RolePermissions {
  permissions: number[];
  pages: {
    page_name: string;
    id: number;
  }[];
  role_name: string;
  role_id: number;
}

export interface Category {
  name: string;
  description: string;
  status: number;
  id: number;
}

export interface CategoryTypes extends BasePaginatedRes {
  items: Category[];
}

export interface UsersType {
  username: string;
  id: number;
  full_name: string;
  email: string | null;
  phone_number: string | null;
  group: {
    name: string;
    id: number;
  } | null;
  status: number;
}

export interface UsersTypes extends BasePaginatedRes {
  items: UsersType[];
}

export enum Screens {
  requests = "requests",
  brigada = "brigada",
  warehouse = "warehouse",
  users = "users",
  category = "category",
  maps = "maps",
  statistics = "statistics",
  fillials = "fillials",
  permitted = "permitted",
  roles = "roles",
  comments = "comments",
}
