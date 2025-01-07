import { useQuery } from "@tanstack/react-query";
import { EPresetTimes, ServiceStatsTypes, Sphere } from "@/utils/types";
import dayjs from "dayjs";
import { yearMonthDate } from "@/utils/keys";
import baseApi from "@/api/base_api";

interface Params {
  enabled?: boolean;
  finished_at?: string;
  started_at?: string;
  sphere_status?: Sphere;
}
const config = { timeout: EPresetTimes.MINUTE * 4 };
export const useApcServiceStats = ({
  enabled,
  started_at = dayjs().startOf("month").format(yearMonthDate),
  finished_at = dayjs().format(yearMonthDate),
  ...params
}: Params) => {
  return useQuery({
    queryKey: ["Apc_service_stats", finished_at, started_at, params],
    queryFn: ({ signal }) =>
      baseApi
        .get(
          params.sphere_status === Sphere.retail
            ? "/v1/arc/stats"
            : "/v1/arc/factory/stats",
          {
            params: {
              finished_at,
              started_at,
              ...params,
            },
            ...config,
            signal,
          }
        )
        .then(({ data: response }) => response as ServiceStatsTypes),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
    refetchOnMount: true,
  });
};
export default useApcServiceStats;
