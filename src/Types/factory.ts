import { BrigadaType, Category, Comments } from "@/utils/types";

export interface FactoryRequestRes {
  id: number;
  user_id: number;
  division_id: string;
  status: number;
  user?: UserTypes;
  division?: DivisionRes;
  description?: string;
  brigada: BrigadaType;
  category?: Category;
  is_bot: number;
  created_at: string;
  user_manager: string;
  comments?: Comments[];
  finished_at?: string;
  started_at?: string;
  deny_reason?: string;
  file?: { url: string; id: number }[];
}

export interface FactoryRequestParams extends BaseParams {
  id?: number;
  status?: string;
  fillial_id?: string;
  user_id?: number;
  created_at?: string;
  user?: string;
  responsible?: number;
  category_id?: number;
}

export interface FactoryRequestBody {
  id?: number;
  status?: number;
  brigada_id?: number;
  deny_reason?: string;
  category_id?: number;
}

export interface DivisionRes {
  id: string;
  name: string;
  manager_id: number;
  status: number;
  manager: ManagerRes;
}

export interface ManagerRes {
  id: number;
  name: string;
  description: string;
  status: number;
}

export interface ManagerBody {
  id?: number;
  name: string;
  description: string;
  status?: number;
}
export interface FactoryManagersParams extends BaseParams {
  name?: string;
  description?: string;
  status?: number;
}
export interface FactoryDivisionParams extends BaseParams {
  name?: string;
  parent_id?: string;
  manager_id?: number;
  status?: number;
}

export interface FactoryDivisionBody {
  name: string;
  manager_id: number;
  status: number;
  id?: string;
}

export interface FactoryDivisionRes {
  id: string;
  name: string;
  manager_id: number;
  status: number;
  manager: ManagerRes;
}

export interface ToolsParams {
  name?: string;
  parent_id?: string;
  enabled?: boolean;
}

export interface ToolsBody {
  name?: string;
  status?: number;
  category_id?: number;
  file?: string | null;
  id: number;
  factory_ftime?: number;
}

export interface ToolRes {
  id: number;
  name: string;
  status: number;
  file: string;
  category_id: number;
  factory_ftime?: number;
  category: {
    name: string;
    description: string;
    status: number;
    id: number;
    urgent: true;
    sub_id: number;
    department: number;
    sphere_status: number;
    file: string;
    ftime: number;
    parent_id: number;
    is_child: true;
    telegram_id: number;

    telegram: {
      id: number;
      chat_id: string;
      name: string;
    };
    price: number;
  };
}

export interface ToolsProductsType {
  id: number;
  name: string;
  status: number;
  file: string;
  parentid: string;
  factory_ftime: number;
}

export interface ToolsRes {
  groups: {
    id: string;
    name: string;
    parent_id: string;
  }[];

  products: ToolsProductsType[];
}

export interface CategoriesTools {
  id: number;
  name: string;
  status: number;
  file: string;
  parentid: string;
}

export interface CategoryToolParams extends BaseParams {
  category_id?: number;
  name?: string;
}
