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
