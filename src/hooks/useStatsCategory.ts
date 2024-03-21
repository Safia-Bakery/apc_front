import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import apiClient from "@/main";
import { permissionSelector } from "reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import {
  CategoryStatTypes,
  Departments,
  EPresetTimes,
  MainPermissions,
  Sphere,
} from "@/utils/types";
import { yearMonthDate } from "@/utils/keys";

interface BodyTypes {
  enabled?: boolean;
  timer?: number;
  department: Departments;
  sphere_status: Sphere;
  started_at?: string;
  finished_at?: string;
}

export const useStatsCategory = ({
  enabled = true,
  timer = 60,
  department,
  sphere_status,
  started_at = dayjs().startOf("month").format(yearMonthDate),
  finished_at = dayjs().format(yearMonthDate),
}: BodyTypes) => {
  const permmission = useAppSelector(permissionSelector);
  return useQuery({
    queryKey: [
      "stats_category",
      started_at,
      finished_at,
      sphere_status,
      department,
    ],
    queryFn: () =>
      apiClient
        .get({
          url: "/v1/stats/category",
          params: {
            timer,
            department,
            sphere_status,
            started_at,
            finished_at,
          },
        })
        .then(({ data: response }) => {
          return response as CategoryStatTypes;
        }),
    staleTime: EPresetTimes.MINUTE * 10,
    enabled:
      enabled &&
      (permmission?.[MainPermissions.stats_apc_fabric] ||
        permmission?.[MainPermissions.stats_apc_fabric]),
  });
};
export default useStatsCategory;
