import baseApi from "@/api/base_api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const getSchedules = ({ enabled }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["get_schedule"],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/schedules", {
          signal,
        })
        .then(({ data: response }) => (response as ScheduleRes[]) || null),
    enabled,
  });
};

export const getSchedule = ({
  enabled,
  id,
}: {
  enabled?: boolean;
  id: number;
}) => {
  return useQuery({
    queryKey: ["get_schedule", id],
    queryFn: ({ signal }) =>
      baseApi
        .get(`/api/v2/schedules/${id}`, {
          signal,
        })
        .then(({ data: response }) => (response as ScheduleRes) || null),
    enabled,
  });
};

export const editAddSchedule = () => {
  return useMutation({
    mutationKey: ["schedule_edit_mutation"],
    mutationFn: async (body: ScheduleBody) => {
      const { data } = await baseApi[!!body.id ? "put" : "post"](
        "/api/v2/schedules",
        body
      );
      return data;
    },
  });
};
