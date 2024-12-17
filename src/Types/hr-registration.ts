interface HrAppointmentRes {
  id: number;
  employee_name: string;
  time_slot: string;
  status: number;
  description: string;
  department: number;
  deny_reason: string;
  created_at?: string;
  position?: {
    id: number;
    name: string;
    department: number;
    created_at: string;
  };
  user?: {
    id: number;
    username: string;
    full_name: string;
    telegram_id: number;
    branch_id: string;
    branch?: {
      id: string;
      name: string;
      status: number;
      country: string;
    };
  };
  branch?: {
    id: string;
    name: string;
    status: number;
    country: string;
  };
}

interface HrAppointmentBody {
  id?: number;
  employee_name?: string;
  time_slot?: string;
  status?: number;
  description?: string;
  deny_reason?: string;
  position_id?: number;
  branch_id?: string;
}

interface HrAppointmentParams extends BaseParams {
  request_id?: number;
  employee_name?: string;
  status?: number;
  position_id?: number;
  branch_id?: string;
  created_user?: string;
}

interface HRPositions {
  id: number;
  name: string;
  department: number;
  created_at?: string;
  status: number;
}

interface HRPositionsParams {
  id?: number;
  status: number;
}

interface HRPOsitionBody {
  status: number;
  id?: number;
  name: string;
}

interface TimeSlotsRes {
  all: string[];
  reserved?: {
    [key: string]: {
      employee_name: string;
      id: number;
      description: null;
      deny_reason: null;
      user_id: number;
      created_at: string;
      time_slot: string;
      status: number;
      department: number;
      position_id: number;
      branch_id: string;
    }[];
  };
  free: { [key: string]: [] };
}

interface CalendarAppointment {
  id: number;
  title: string;
  date: string;
  status: number;
  description: string;
  department: number;
  deny_reason: string;
  position?: {
    id: number;
    name: string;
    department: number;
    created_at: string;
  };
  user?: {
    id: number;
    username: string;
    full_name: string;
    email: string;
    phone_number: string;
    status: number;
  };
  branch?: {
    id: string;
    name: string;
    status: number;
    country: string;
  };
}
