import baseApi from "@/api/base_api";
import { EPresetTimes } from "@/utils/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const getAppointments = ({ enabled, ...params }: BaseParams) => {
  return useQuery({
    queryKey: ["hr_appointments", params],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/appointments", {
          params,
          signal,
        })
        .then(
          ({ data: response }) =>
            (response as BasePaginateRes<HrAppointmentRes>) || null
        ),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};
export const getCalendarAppointments = ({ enabled }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["hr__calendar_appointments"],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/appointments/calendar", {
          signal,
        })
        .then(
          ({ data: response }) => (response as CalendarAppointment[]) || null
        ),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const getMyAppointments = ({ enabled, ...params }: BaseParams) => {
  return useQuery({
    queryKey: ["get_my_appointment", params],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/appointments/my_records", {
          signal,
        })
        .then(({ data: response }) => (response as HrAppointmentRes[]) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const getAppointment = ({
  enabled,
  id,
}: {
  enabled?: boolean;
  id: number;
}) => {
  return useQuery({
    queryKey: ["get_hr_appointment", id],
    queryFn: ({ signal }) =>
      baseApi
        .get(`/api/v2/appointments/${id}`, {
          signal,
        })
        .then(({ data: response }) => (response as HrAppointmentRes) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const editAddAppointment = () => {
  return useMutation({
    mutationKey: ["edit_add_appointment"],
    mutationFn: async ({ id, ...body }: HrAppointmentBody) => {
      if (id) {
        const { data } = await baseApi.put(`/api/v2/appointments/${id}`, body);
        return data;
      } else {
        const { data } = await baseApi.post(`/api/v2/appointments`, body);
        return data;
      }
    },
  });
};

export const getHrTimeSlots = ({
  enabled,
  query_date,
}: {
  enabled?: boolean;
  query_date: string;
}) => {
  return useQuery({
    queryKey: ["get_hr_appointment_time_slots", query_date],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/appointments/time_slot/", {
          signal,
          params: { query_date },
        })
        .then(({ data: response }) => (response as TimeSlotsRes) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const getPositions = ({ enabled }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["get_positions"],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/positions", {
          signal,
        })
        .then(({ data: response }) => (response as HRPositions[]) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const getPosition = ({
  enabled,
  id,
}: {
  enabled?: boolean;
  id: number;
}) => {
  return useQuery({
    queryKey: ["get_position", id],
    queryFn: ({ signal }) =>
      baseApi
        .get(`/api/v2/positions/${id}`, {
          signal,
        })
        .then(({ data: response }) => (response as HRPositions) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const editAddPosition = () => {
  return useMutation({
    mutationKey: ["edit_add_position"],
    mutationFn: async (body: HRPOsitionBody) => {
      const { data } = await baseApi[body.id ? "put" : "post"](
        "/api/v2/positions",
        body
      );
      return data;
    },
  });
};
