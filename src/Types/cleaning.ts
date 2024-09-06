interface CalendarBody {
  branch_id: string;
  date: string;
  is_active: number;
  id?: string;
}

interface CalendarParams {
  current_date: string; //yil oy kun
  id?: number;
  enabled?: boolean;
}

interface CalendarParam {
  id?: number;
  enabled?: boolean;
  isDelete?: boolean;
}

interface CalendarTypes {
  id: number;
  branch_id: string;
  date: string;
  branch: {
    id: string;
    name: string;
    status: number;
    country: string;
  };
  is_active: number;
}
