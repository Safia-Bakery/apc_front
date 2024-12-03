interface CoinRes {
  id: number;
  user_id: number;
  description: string;
  fillial_id: string;
  status: number;
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
    manager_id: number;
    status: number;
    parentfillial?: { name: string };
    manager?: {
      id: number;
      name: string;
      description: string;
      status: number;
    };
  };
  is_bot: number;
  created_at: string;
  user_manager: string;
  started_at: string;
  amount: number;
  finished_at: string;
  deny_reason?: string;
}

interface CoinParams extends BaseParams {
  user_id?: number;
  fillial_id?: string;
  status?: number;
  id?: number;
}

interface CoinBody {
  status: number;
  deny_reason?: string;
  id: number;
}
