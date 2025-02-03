interface KruCategoryBody {
  name?: string;
  id?: number;
  parent?: number;
  description?: string;
  start_time?: string;
  end_time?: string;
  tool_id?: number;
}

interface KruCategoryParams extends BaseParams {
  id?: number;
  name?: string;
  tg_id?: number;
}

interface KruCategoryRes {
  id: number;
  name: string;
  description: string;
  status: number;
  products_count?: number;
  parent: number;
  start_time: string;
  end_time: string;
  kru_task: KruTaskRes[];
  tool: {
    id: number;
    name: string;
    num: number;
    code: string;
  };
  sub_categories: number;
  created_at: string;
  updated_at: string;
}

interface KruTaskBody {
  name: string;
  id?: number;
  kru_category_id: number;
  description?: string;
  answers?: string[];
}

interface KruTaskParams extends BaseParams {
  id?: number;
  name?: string;
  kru_category_id?: number;
}

interface KruTaskRes {
  id: number;
  name: string;
  kru_category_id?: number;
  description?: string;
  status?: number;
  answers?: string[];
}

interface KruAvailableTasksRes {
  products: {
    id: number;
    name: string;
    num: string;
    code: string;
  }[];
  tasks: KruTaskRes[];
}

interface FinishedTasksBody {
  tg_id: number;
  tool_id: number;
  kru_category_id: number;
  answers?: {
    task_id: number;
    comment: string;
  }[];
}

interface KruAvailableTaskParams {
  category_id: number;
  category_name?: string;
  enabled?: boolean;
  tg_id: number;
}

interface KruToolsParams {
  enabled?: boolean;
  tool_name: string;
}

interface KruToolsRes {
  folders: {
    id: string;
    name: string;
    parent_id: string;
  }[];
  tools: KruTool[];
}
interface KruTool {
  id: number;
  name: string;
  status: number;
  code: string;
  image: string;
  parentid: string;
}
interface KruReportsBody {
  report_type: number;
  start_date?: string;
  finish_date?: string;
  category_id?: number;
  branch_id?: string;
  product_code?: string;
  product_name?: string;
  answer?: string;
}
