interface ScheduleBody {
  id?: number;
  time?: string;
  is_available?: boolean;
  description?: string;
  date?: string;
}

interface ScheduleRes {
  id: number;
  date: string;
  time: string;
  is_available: true;
  description: string;
  department: number;
  created_at: string;
  updated_at: string;
  appointments: {
    id: number;
    employee_name: string;
    time_slot: string;
    status: number;
    description: string;
    department: number;
    deny_reason: string;
    created_at: string;
    position: {
      id: number;
      name: string;
      status: number;
      department: number;
      created_at: string;
    };
    user: {
      id: number;
      username: string;
      full_name: string;
      email: string;
      phone_number: string;
      status: number;
    };
    branch: {
      id: string;
      name: string;
      status: number;
      country: string;
    };
    file: {
      id: number;
      url: string;
    }[];
    updated_at: string;
  }[];
}
