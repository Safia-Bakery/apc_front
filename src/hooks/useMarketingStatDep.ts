import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import baseApi from "@/api/base_api";
import { permissionSelector } from "reducers/sidebar";
import { MainPermissions } from "@/utils/permissions";
import { useAppSelector } from "@/store/utils/types";
import { MarketingDepartmentTypes, EPresetTimes } from "@/utils/types";
import { yearMonthDate } from "@/utils/keys";

interface BodyTypes {
  enabled?: boolean;
  timer?: number;
  started_at?: string;
  finished_at?: string;
}

export const useMarketingStatDep = ({
  enabled = true,
  timer = 3600,
  started_at = dayjs().startOf("month").format(yearMonthDate),
  finished_at = dayjs().format(yearMonthDate),
}: BodyTypes) => {
  const permmission = useAppSelector(permissionSelector);
  return useQuery({
    queryKey: ["stats_marketing_dep", started_at, finished_at],
    queryFn: () =>
      baseApi
        .get("/v1/stats/marketing/pie", {
          params: {
            timer,
            created_at: started_at,
            finished_at,
          },
        })
        .then(({ data: response }) => {
          return response as MarketingDepartmentTypes;
        }),
    staleTime: EPresetTimes.MINUTE * 10,
    enabled: enabled && permmission?.[MainPermissions.stats_marketing],
  });
};
export default useMarketingStatDep;
