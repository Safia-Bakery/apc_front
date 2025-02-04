interface InventoryRequestBody {
  id?: number;
  fillial_id?: string;
  category_id?: number;
  description?: string;
  phone_number?: string;
  product?: string;
  department?: number;
  files?: string[];
  status?: number;
  expenditure?: {
    amount: number;
    tool_id: number | string;
  }[];
}

interface InventoryReqParams {
  enabled?: boolean;
  size?: number;
  product?: string;
  page?: number;
  department?: number;
  request_status?: string;
  created_at?: string;
  fillial_id?: string;
  user?: string;
  id?: number;
}

interface InventoryReqRes {
  id: number;
  product: string;
  description: string;
  deny_reason: string;
  pause_reason: string;
  rating: number;
  created_at: string;
  status: number;
  brigada?: {
    id: number;
    name: string;
    description: string;
    status: number;
    user?: [
      {
        id: number;
        username: string;
        full_name: string;
        email: string;
        phone_number: string;
        status: number;
      }
    ];
    sphere_status: number;
    department: number;
    is_outsource: true;
    chat_id: number;
    topic_id: number;
  };
  file?: {
    url: string;
    status: number;
  }[];
  category?: {
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
  fillial?: {
    id: string;
    name: string;
    origin: number;
    manager?: {
      id: number;
      name?: string;
      description: string;
      status: number;
    };
    parentfillial: {
      name: string;
    };
  };
  started_at: string;
  finished_at: string;
  user?: {
    id: number;
    username: string;
    full_name: string;
    email: string;
    phone_number: string;
    status: number;
  };
  user_manager: string;
  expanditure?: {
    id: number;
    amount: number;
    tool?: {
      id: number;
      name: string;
      code: string;
      mainunit: string;
      producttype: string;
      iikoid: string;
      price: number;
      parentid: string;
      total_price: number;
      amount_left: number;
      min_amount: number;
      max_amount: number;
      ftime: number;
      status: number;
      image: string;
      file: string;

      category_id: number;
    };
    comment: string;
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
  comments: [
    {
      id: number;
      user: {
        id: number;
        username: string;
        full_name: string;
        email: string;
        phone_number: string;
        status: number;
      };
      comment: string;
      rating: number;
    }
  ];
  is_bot: true;
  size: string;
  arrival_date: string;
  bread_size: string;
  location: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
  update_time: {
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  };
  finishing_time: string;
  is_redirected: true;
  old_cat_id: number;
  request_orpr?: {
    id: number;
    amount: number;
    orpr_product: {
      name: string;
      prod_cat: {
        name: string;
        price: number;
      };
    };
  }[];
  cars?: {
    id: number;
    name: string;
    status: number;
    number: string;
  };
  communication?: [
    {
      id: number;
      message: string;
      status: number;
      user: {
        id: number;
        username: string;
        full_name: string;
        email: string;
        phone_number: string;
        status: number;
      };
      photo: string;
      created_at: string;
    }
  ];
  price: number;
  phone_number: string;
  tg_message_id: number;
  log: [
    {
      id: number;
      user: {
        id: number;
        username: string;
        full_name: string;
        email: string;
        phone_number: string;
        status: number;
      };
      created_at: string;
      status: number;
    }
  ];
}

interface InventoryReqsRes {
  id: number;
  user?: {
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
  fillial?: {
    id: string;
    name: string;
    origin: number;
    parentfillial?: {
      name: string;
    };
  };
  expanditure?: {
    id: number;
    amount: number;
    tool?: {
      id: number;
      name: string;
      status: number;
      file: string;
      category_id: number;
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
        telegram?: {
          id: number;
          chat_id: string;
          name: string;
        };
        price: number;
      };
    };
    comment: string;
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
  created_at: string;
  status: number;
  user_manager: string;
}
