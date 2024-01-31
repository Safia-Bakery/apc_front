import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import {
  Departments,
  MarketingSubDep,
  ServiceStatsTypes,
  Sphere,
} from "@/utils/types";

interface Params {
  enabled?: boolean;
  finished_at?: string;
  started_at?: string;
  sub_id?: MarketingSubDep;
  department: Departments;
  sphere_status?: Sphere;
}

export const useServiceMarkStats = (params: Params) => {
  return useQuery({
    queryKey: ["Service_Mark_Stats", params],
    queryFn: () =>
      apiClient
        .get("/v2/stats/marketing", params)
        .then(({ data: response }) => response as ServiceStatsTypes),
    enabled: params.enabled,
    refetchOnMount: true,
  });
};
export default useServiceMarkStats;

//  /v2/stats/marketing
