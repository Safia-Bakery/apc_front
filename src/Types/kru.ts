interface KruCategoryBody {
  name: string;
  id?: number;
}

interface KruCategoryParams extends BaseParams {
  id?: number;
  name?: string;
}

interface KruCategoryRes {
  id: number;
  name: string;
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
}
