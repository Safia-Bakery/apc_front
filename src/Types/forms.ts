interface FormRes {
  id: number;
  user?: {
    id: number;
    username: string;
    full_name: string;
    email: string;
    phone_number: string;
    status: number;
  };
  fillial?: {
    id: string;
    name: string;
    origin: number;
    parentfillial?: {
      name: string;
    };
  };
  user_manager: string;
  created_at: string;
  deny_reason: string;
  description: string;
  pause_reason: string;
  status: number;
  category?: FormCategoryRes;
  started_at: string;
  finished_at: string;
  request_orpr?: {
    id: number;
    amount: number;
    orpr_product?: {
      name: string;
      prod_cat?: {
        name: string;
        price: number;
      };
    };
    confirmed: boolean;
    deny_reason: string;
  }[];
  price: number;
  phone_number: string;
  log?: {
    id: number;
    user?: {
      id: number;
      username: string;
      full_name: string;
      email: string;
      phone_number: string;
      status: number;
    };
    created_at: string;
    status: number;
  }[];
}

interface FormParams extends BaseParams {
  id?: number;
  fillial_id?: string;
  created_at?: string;
  status?: number;
}

interface FormBody {
  id?: number;
  status?: number;
  deny_reason?: string;
  request_products?: {
    id: number;
    amount: number;
    orpr_product?: {
      name: string;
      prod_cat?: {
        name: string;
        price: number;
      };
    };
    confirmed: boolean;
    deny_reason: string;
  }[];
}

interface FormCreateBody {
  fillial_id: string;
  request_products: {
    category_id: number;
    product_id: number;
    amount: number;
    price: number;
  }[];
}

interface FormCategoryRes {
  id: number;
  name: string;
  price: number;
  description: string;
  status: number;
  urgent: boolean;
  universal_size: boolean;
}

interface FormCategoryBody {
  id?: number;
  name: string;
  price: number;
  description?: string;
  status: number;
  urgent: boolean;
  universal_size: boolean;
}

interface FormCategoryParams {
  name?: string;
  enabled?: boolean;
}
