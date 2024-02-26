import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { ServiceStatsTypes, Sphere } from "@/utils/types";
import dayjs from "dayjs";
import { yearMonthDate } from "@/utils/keys";

interface Params {
  enabled?: boolean;
  finished_at?: string;
  started_at?: string;
  sphere_status?: Sphere;
}

export const useApcServiceStats = ({
  enabled,
  started_at = dayjs().startOf("month").format(yearMonthDate),
  finished_at = dayjs().format(yearMonthDate),
  ...params
}: Params) => {
  return useQuery({
    queryKey: ["Apc_service_stats", finished_at, started_at, params],
    queryFn: () =>
      apiClient
        .get({
          url: "/v1/arc/stats",
          params: {
            finished_at,
            started_at,
            ...params,
          },
        })
        .then(({ data: response }) => response as ServiceStatsTypes),
    enabled,
    refetchOnMount: true,
  });
};
export default useApcServiceStats;
