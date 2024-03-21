import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import {
  Departments,
  EPresetTimes,
  MarketingSubDep,
  ServiceStatsTypes,
  Sphere,
} from "@/utils/types";
import dayjs from "dayjs";
import { yearMonthDate } from "@/utils/keys";

interface Params {
  enabled?: boolean;
  finished_at?: string;
  started_at?: string;
  sub_id?: MarketingSubDep;
  department: Departments;
  sphere_status?: Sphere;
}

const config = { timeout: EPresetTimes.SECOND * 10 };

export const useServiceMarkStats = ({
  enabled,
  started_at = dayjs().startOf("month").format(yearMonthDate),
  finished_at = dayjs().format(yearMonthDate),
  ...params
}: Params) => {
  return useQuery({
    queryKey: ["Service_Mark_Stats", finished_at, started_at, params],
    queryFn: () =>
      apiClient
        .get({
          url: "/v2/stats/marketing",
          params: {
            finished_at,
            started_at,
            ...params,
          },
          config,
        })
        .then(({ data: response }) => response as ServiceStatsTypes),
    enabled,
    staleTime: EPresetTimes.MINUTE * 10,
    refetchOnMount: true,
  });
};
export default useServiceMarkStats;
