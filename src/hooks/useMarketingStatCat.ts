import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import apiClient from "@/main";
import { permissionSelector } from "reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import { MarketingDepartmentTypes, MainPermissions } from "@/utils/types";

interface BodyTypes {
  enabled?: boolean;
  created_at?: string;
  finished_at?: string;
}

export const useMarketingStatCat = ({
  enabled = true,
  created_at = dayjs().startOf("month").format("YYYY-MM-DD"),
  finished_at = dayjs().format("YYYY-MM-DD"),
}: BodyTypes) => {
  const permmission = useAppSelector(permissionSelector);
  return useQuery({
    queryKey: ["stats_marketing_cat", created_at, finished_at],
    queryFn: () =>
      apiClient
        .get("/v1/stats/marketing/cat", {
          created_at,
          finished_at,
        })
        .then(({ data: response }) => {
          return response as MarketingDepartmentTypes;
        }),
    enabled: enabled && permmission?.[MainPermissions.get_statistics],
  });
};
export default useMarketingStatCat;
