import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { EPresetTimes } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";

export const useCalendars = ({ enabled, ...params }: CalendarParams) => {
  return useQuery({
    queryKey: ["calendars", params],
    queryFn: () =>
      apiClient
        .get({
          url: "/calendar",
          params,
        })
        .then(({ data: response }) => response as CalendarTypes[]),
    enabled,
    staleTime: EPresetTimes.MINUTE * 5,
  });
};

export const useCalendar = ({ enabled, id }: CalendarParam) => {
  return useQuery({
    queryKey: ["calendar", id],
    queryFn: () => {
      apiClient
        .get({
          url: `/calendar/${id}`,
        })
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
        const { data } = await apiClient.post({ url: "/calendar", body });
        return data as CalendarTypes;
      } else {
        const { data } = await apiClient.put({ url: "/calendar", body });
        return data as CalendarTypes;
      }
    },
  });
};

export const deleteCalendar = () => {
  return useMutation({
    mutationKey: ["delete_calendar"],
    mutationFn: async (id: number) => {
      const { data } = await apiClient.delete({
        url: `/calendar/${id}`,
      });
      return data as CalendarTypes;
    },
  });
};
