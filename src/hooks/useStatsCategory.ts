import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import apiClient from "@/main";
import { permissionSelector } from "reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import {
  CategoryStatTypes,
  Departments,
  MainPermissions,
  Sphere,
} from "@/utils/types";

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
  started_at = dayjs().startOf("month").format("YYYY-MM-DD"),
  finished_at = dayjs().format("YYYY-MM-DD"),
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
        .get("/v1/stats/category", {
          timer,
          department,
          sphere_status,
          started_at,
          finished_at,
        })
        .then(({ data: response }) => {
          return response as CategoryStatTypes;
        }),
    enabled: enabled && permmission?.[MainPermissions.get_statistics],
  });
};
export default useStatsCategory;
