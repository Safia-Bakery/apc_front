export enum EPresetTimes {
  SECOND = 1000,
  MINUTE = SECOND * 60,
  HOUR = MINUTE * 60,
  DAY = HOUR * 24,
  WEEK = DAY * 7,
  TEN_DAYS = DAY * 10,
}

export interface CategoryTypes {
  id: number;
  name: string;
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

export interface UsersTypes {
  username: string;
  hashed_password: string;
  time_created: string;
  id: number;
  role: StatusRoles;
  full_name: string;
  telegram_id: number;
}

export interface Order {
  purchaser: string;
  seller: string;
  price: number;
  status: StatusRoles;
  urgent: boolean;
  description: string;
  id: number;
  product: string;
  delivery_time: Date;
  payer: string;
  time_created: Date;
  payment_type: string;
  image?: string;
  category: CategoryTypes;
}

export interface OrderType {
  items: Order[];
  total: number;
  page: number;
  size: number;
  pages: number;
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

export enum StatusRoles {
  musa = "musa",
  shakhzod = "shakhzod",
  begzod = "begzod",
  fin = "fin",
  accountant = "accountant",
  unconfirmed = "unconfirmed",
  purchasing = "purchasing",
  superadmin = "superadmin",
  paid = "paid",
  denied = "denied",
}

export interface MeTypes {
  id: number;
  username: string;
  role: StatusRoles;
}
export enum Status {
  accepted = "accepted",
  denied = "denied",
}
