interface FreezerBody {
  products?: ProductItems[];
  id?: number;
  status?: number;
}

interface ProductItems {
  product_id: number;
  amount?: number;
}

interface FreezerOrderRes {
  id: number;
  branch_id: string;
  branch: {
    id: string;
    name: string;
    status: number;
    country: string;
  };
  status: number;
  created_by: number;
  accepted_by: number;
  created_at?: string;
  updated_at?: string;
  created_user: {
    id: number;
    username: string;
    full_name: string;
    email: string;
    phone_number: string;
    group: {
      id: number;
      name: string;
      status: number;
    };
    status: number;
  };
  accepted_user: {
    id: number;
    username: string;
    full_name: string;
    email: string;
    phone_number: string;
    group: {
      id: number;
      name: string;
      status: number;
    };
    status: number;
  };
  order_item: {
    product: {
      name: string;
      id: number;
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
    };
    amount: number;
  }[];
}

interface FreezerToolType {
  image?: string;
  name?: string;
  id: string | number;
  count: number;
}
