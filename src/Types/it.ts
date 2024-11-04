interface ItrequestsParams {
  enabled?: boolean;
  size?: number;
  page?: number;
  request_status?: string;
  created_at?: string;
  fillial_id?: string;
  user?: string;
  id?: number;
  category_id?: number;
  brigada_id?: number;
  arrival_date?: string;
  rate?: boolean;
  urgent?: boolean;
  started_at?: string;
  finished_at?: string;
}

interface ITrequestBody {
  id?: number;
  fillial_id: string;
  category_id: number;
  description?: string;
  product?: string;
  expenditure?: {
    amount: number;
    tool_id: number | string;
  }[];
}

interface ItLogs {
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

interface ITRequestRes {
  id: number;
  product: string;
  description: string;
  deny_reason: string;
  pause_reason: string;
  rating: number;
  created_at: string;
  status: number;
  brigada: {
    id: number;
    name: string;
    description: string;
    status: number;
    user: {
      id: number;
      username: string;
      full_name: string;
      email: string;
      phone_number: string;
      status: number;
    }[];
    sphere_status: number;
    department: number;
    is_outsource: true;
    chat_id: number;
    topic_id: number;
  };
  file: {
    url: string;
    status: number;
  }[];
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
  fillial: {
    id: string;
    name: string;
    origin: number;
    parentfillial: {
      name: string;
    };
  };
  started_at: string;
  finished_at: string;
  user: {
    id: number;
    username: string;
    full_name: string;
    email: string;
    phone_number: string;
    group: {
      name: string;
      id: number;
    };
    status: number;
  };
  user_manager: string;
  expanditure: {
    id: number;
    amount: number;
    tool: {
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
      category_id: number;
    };
    comment: string;
    user: {
      id: number;
      username: string;
      full_name: string;
      email: string;
      phone_number: string;
      group: {
        name: string;
        id: number;
      };
      status: number;
    };
    created_at: string;
    status: number;
  }[];
  comments: {
    id: number;
    user: {
      id: number;
      username: string;
      full_name: string;
      email: string;
      phone_number: string;
      group: {
        name: string;
        id: number;
      };
      status: number;
    };
    comment: string;
    rating: number;
  }[];
  is_bot: true;
  size: string;
  arrival_date: string;
  bread_size: string;
  location: {
    [key: string]: string;
  };
  update_time: {
    [key: string]: string;
  };
  finishing_time: string;
  is_redirected: true;
  old_cat_id: number;
  request_orpr: {
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
  cars: {
    id: number;
    name: string;
    status: number;
    number: string;
  };
  communication: {
    id: number;
    message: string;
    status: number;
    user: {
      id: number;
      username: string;
      success: true;
      full_name: string;
      status: number;
      sphere_status: number;
      brigader: string;
      brigada_id: string;
      group_id: number;
      group: string;
      telegram_id: number;
    };
    photo: string;
    created_at: string;
  }[];
  price: number;
  phone_number: string;
  log: ItLogs[];
}
