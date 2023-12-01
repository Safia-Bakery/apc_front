import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import apiClient from "src/main";
import { permissionSelector } from "src/store/reducers/sidebar";
import { useAppSelector } from "src/store/utils/types";
import { MarketingDepartmentTypes, MainPermissions } from "src/utils/types";

interface BodyTypes {
  enabled?: boolean;
  timer?: number;
  started_at?: string;
  finished_at?: string;
}

export const useMarketingStatDep = ({
  enabled = true,
  timer = 3600,
  started_at = dayjs().startOf("month").format("YYYY-MM-DD"),
  finished_at = dayjs().format("YYYY-MM-DD"),
}: BodyTypes) => {
  const permmission = useAppSelector(permissionSelector);
  return useQuery({
    queryKey: ["stats_marketing_dep", started_at, finished_at],
    queryFn: () =>
      apiClient
        .get("/v1/stats/marketing/pie", {
          timer,
          created_at: started_at,
          finished_at,
        })
        .then(({ data: response }) => {
          return response as MarketingDepartmentTypes;
        }),
    enabled: enabled && permmission?.[MainPermissions.get_statistics],
  });
};
export default useMarketingStatDep;
