import { useQuery } from "@tanstack/react-query";

import { EPresetTimes } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";

export const useCalendars = ({ enabled, ...params }: CalendarParams) => {
  return useQuery({
    queryKey: ["calendars", params],
    queryFn: () =>
      baseApi
        .get("/calendar", { params })
        .then(({ data: response }) => response as CalendarTypes[]),
    enabled,
    staleTime: EPresetTimes.MINUTE * 5,
  });
};

export const useCalendar = ({ enabled, id }: CalendarParam) => {
  return useQuery({
    queryKey: ["calendar", id],
    queryFn: () => {
      baseApi
        .get(`/calendar/${id}`)
        .then(({ data: response }) => response as CalendarTypes);
    },
    enabled,
    staleTime: EPresetTimes.MINUTE * 5,
  });
};

export const editAddCalendarMutation = () => {
  return useMutation({
    mutationKey: ["edit_add_calendar"],
    mutationFn: async (body: CalendarBody) => {
      if (!body.id) {
        const { data } = await baseApi.post("/calendar", body);
        return data as CalendarTypes;
      } else {
        const { data } = await baseApi.put("/calendar", body);
        return data as CalendarTypes;
      }
    },
  });
};

export const deleteCalendar = () => {
  return useMutation({
    mutationKey: ["delete_calendar"],
    mutationFn: async (id: number) => {
      const { data } = await baseApi.delete(`/calendar/${id}`);
      return data as CalendarTypes;
    },
  });
};
