import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { Departments, EPresetTimes, ItServiceStatTypes } from "@/utils/types";
import dayjs from "dayjs";
import { yearMonthDate } from "@/utils/keys";

interface Params {
  enabled?: boolean;
  finished_at?: string;
  started_at?: string;
  department?: Departments;
}
const config = { timeout: EPresetTimes.MINUTE * 5 };
export const useITServiseStats = ({
  enabled,
  started_at = dayjs().startOf("month").format(yearMonthDate),
  finished_at = dayjs().format(yearMonthDate),
  ...params
}: Params) => {
  return useQuery({
    queryKey: ["Service_IT_Stats", finished_at, started_at, params],
    queryFn: () =>
      apiClient
        .get({
          url: "/it/stats",
          params: {
            finished_at,
            started_at,
            ...params,
          },
          config,
        })
        .then(({ data: response }) => response as ItServiceStatTypes),
    enabled,
    staleTime: EPresetTimes.MINUTE * 10,
    retry: 2,
    refetchOnMount: true,
  });
};
export default useITServiseStats;
