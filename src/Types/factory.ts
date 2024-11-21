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
