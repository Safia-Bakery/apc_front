interface FreezerBody {
  products?: ProductItems[];
  id?: number;
  status?: number;
  message_id?: string | null;
}

interface ProductItems {
  product_id: number;
  amount?: number;
}

interface FreezerOrderRes {
  id: number;
  branch_id: string;
  branch?: {
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
  created_user?: {
    id: number;
    username: string;
    full_name: string;
    email: string;
    phone_number: string;
    group?: {
      id: number;
      name: string;
      status: number;
    };
    status: number;
  };
  accepted_user?: {
    id: number;
    username: string;
    full_name: string;
    email: string;
    phone_number: string;
    group?: {
      id: number;
      name: string;
      status: number;
    };
    status: number;
  };
  order_item?: {
    product?: {
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

interface FreezerMyOrdersRes {
  closed: FreezerOrderRes[];
  active: FreezerOrderRes[];
}

interface FreezerToolType {
  image?: string;
  name?: string;
  id: string | number;
  count: number;
}

interface FreezerBalancesRes {
  branch: {
    name: string;
  };
  tool?: {
    id: number;
    name: string;
    code: string;
    mainunit: string;
    producttype: string;
    iikoid: string;
    ftime: number;
    status: number;
    image: string;
    category_id: number;
  };
  amount: number;
}

interface FreezerBalancesBody {
  tool_id: number;
  amount: number;
}

interface FreezerProductsParams {
  parent_id?: string;
  name?: string;
  enabled?: boolean;
}

interface FreezerToolsProductsType {
  id: number;
  name: string;
  status: number;
  file: string;
  parentid: string;
  image: string;
  category_id: number;
  tool_balances?: {
    branch?: {
      name: string;
    };
    amount: number;
  };
}

interface FreezerGroupType {
  id: string;
  name: string;
  parent_id: string;
  status: number;
}

interface FreezerToolsRes {
  groups: FreezerGroupType[];

  products: FreezerToolsProductsType[];
}
