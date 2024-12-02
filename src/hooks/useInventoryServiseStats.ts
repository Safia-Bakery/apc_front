import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { EPresetTimes, InvServiceStatTypes } from "@/utils/types";
import dayjs from "dayjs";
import { yearMonthDate } from "@/utils/keys";

interface Params {
  enabled?: boolean;
  finished_at?: string;
  started_at?: string;
  factory?: boolean;
}

const config = { timeout: EPresetTimes.MINUTE * 4 };

export const useInventoryServiseStats = ({
  enabled,
  started_at = dayjs().startOf("month").format(yearMonthDate),
  finished_at = dayjs().format(yearMonthDate),
  factory,
  ...params
}: Params) => {
  return useQuery({
    queryKey: [
      "Service_Inventory_Stats",
      finished_at,
      started_at,
      params,
      factory,
    ],
    queryFn: () =>
      baseApi
        .get(factory ? "/v1/stats/inventory/factory" : "/v1/stats/inventory", {
          params: {
            finished_at,
            started_at,
            ...params,
          },
          ...config,
        })
        .then(({ data: response }) => response as InvServiceStatTypes),
    enabled,
    staleTime: EPresetTimes.MINUTE * 10,
    refetchOnMount: true,
  });
};
