import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import {
  Departments,
  MarketingSubDep,
  ServiceStatsTypes,
  Sphere,
} from "@/utils/types";
import dayjs from "dayjs";

interface Params {
  enabled?: boolean;
  finished_at?: string;
  started_at?: string;
  sub_id?: MarketingSubDep;
  department: Departments;
  sphere_status?: Sphere;
}

export const useServiceMarkStats = ({
  enabled,
  started_at = dayjs().startOf("month").format("YYYY-MM-DD"),
  finished_at = dayjs().format("YYYY-MM-DD"),
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
        })
        .then(({ data: response }) => response as ServiceStatsTypes),
    enabled,
    refetchOnMount: true,
  });
};
export default useServiceMarkStats;
