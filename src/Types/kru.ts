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
}

interface KruCategoryRes {
  id: number;
  name: string;
  description: string;
  status: number;
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
}

interface FinishedTasksBody {
  task_id: number;
  comment: string;
  file: string;
}

interface KruAvailableTaskParams {
  category_id?: number;
  category_name?: string;
  enabled?: boolean;
}
