import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import apiClient from "@/main";
import { permissionSelector } from "reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import {
  MarketingDepartmentTypes,
  MainPermissions,
  EPresetTimes,
} from "@/utils/types";
import { yearMonthDate } from "@/utils/keys";

interface BodyTypes {
  enabled?: boolean;
  created_at?: string;
  finished_at?: string;
}

export const useMarketingStatCat = ({
  enabled = true,
  created_at = dayjs().startOf("month").format(yearMonthDate),
  finished_at = dayjs().format(yearMonthDate),
}: BodyTypes) => {
  const permmission = useAppSelector(permissionSelector);
  return useQuery({
    queryKey: ["stats_marketing_cat", created_at, finished_at],
    queryFn: ({ signal }) =>
      apiClient
        .get({
          url: "/v1/stats/marketing/cat",
          params: {
            created_at,
            finished_at,
          },
          config: { signal },
        })
        .then(({ data: response }) => {
          return response as MarketingDepartmentTypes;
        }),
    staleTime: EPresetTimes.MINUTE * 10,
    enabled: enabled && permmission?.[MainPermissions.stats_marketing],
  });
};
export default useMarketingStatCat;
