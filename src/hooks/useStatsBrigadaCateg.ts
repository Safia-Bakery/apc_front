import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { permissionSelector } from "reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import dayjs from "dayjs";
import {
  BrigadaCategStatTypes,
  Departments,
  EPresetTimes,
  MainPermissions,
  Sphere,
} from "@/utils/types";
import { yearMonthDate } from "@/utils/keys";

type BodyTypes = {
  enabled?: boolean;
  timer?: number;
  department: Departments;
  sphere_status: Sphere;
  started_at?: string;
  finished_at?: string;
};

export const useStatsBrigadaCateg = ({
  enabled = true,
  department,
  sphere_status,
  started_at = dayjs().startOf("month").format(yearMonthDate),
  finished_at = dayjs().format(yearMonthDate),
  timer = 60,
}: BodyTypes) => {
  const permmission = useAppSelector(permissionSelector);
  return useQuery({
    queryKey: [
      "stats_brigada_categ",
      started_at,
      finished_at,
      sphere_status,
      department,
    ],
    queryFn: ({ signal }) =>
      baseApi
        .get("/v1/stats/brigada/category", {
          params: {
            department,
            sphere_status,
            started_at,
            finished_at,
            timer,
          },
          signal,
        })
        .then(({ data: response }) => {
          return response as BrigadaCategStatTypes;
        }),
    staleTime: EPresetTimes.MINUTE * 10,
    enabled:
      enabled &&
      (permmission?.[MainPermissions.stats_apc_fabric] ||
        permmission?.[MainPermissions.stats_apc_fabric]),
  });
};
export default useStatsBrigadaCateg;
