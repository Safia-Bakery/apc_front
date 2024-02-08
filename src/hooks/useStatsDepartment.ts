import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import apiClient from "@/main";
import { permissionSelector } from "reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import {
  DepartmentStatTypes,
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

export const useStatsDepartment = ({
  enabled = true,
  department,
  sphere_status,
  started_at = dayjs().startOf("month").format("YYYY-MM-DD"),
  finished_at = dayjs().format("YYYY-MM-DD"),
}: BodyTypes) => {
  const permmission = useAppSelector(permissionSelector);
  return useQuery({
    queryKey: [
      "stats_department",
      started_at,
      finished_at,
      sphere_status,
      department,
    ],
    queryFn: () =>
      apiClient
        .get({
          url: "/v1/stats/department",
          params: {
            department,
            sphere_status,
            started_at,
            finished_at,
          },
        })
        .then(({ data: response }) => {
          return response as DepartmentStatTypes[];
        }),
    enabled:
      enabled &&
      (permmission?.[MainPermissions.stats_apc_fabric] ||
        permmission?.[MainPermissions.stats_apc_fabric]),
  });
};
export default useStatsDepartment;
