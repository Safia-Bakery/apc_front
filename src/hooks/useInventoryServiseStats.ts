import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { InvServiceStatTypes } from "@/utils/types";
import dayjs from "dayjs";
import { yearMonthDate } from "@/utils/keys";

interface Params {
  enabled?: boolean;
  finished_at?: string;
  started_at?: string;
}

export const useInventoryServiseStats = ({
  enabled,
  started_at = dayjs().startOf("month").format(yearMonthDate),
  finished_at = dayjs().format(yearMonthDate),
  ...params
}: Params) => {
  return useQuery({
    queryKey: ["Service_Inventory_Stats", finished_at, started_at, params],
    queryFn: () =>
      apiClient
        .get({
          url: "/v1/stats/inventory",
          params: {
            finished_at,
            started_at,
            ...params,
          },
        })
        .then(({ data: response }) => response as InvServiceStatTypes),
    enabled,
    refetchOnMount: true,
  });
};
export default useInventoryServiseStats;