import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import apiClient from "src/main";
import { permissionSelector } from "src/redux/reducers/auth";
import { useAppSelector } from "src/redux/utils/types";
import {
  DepartmentStatTypes,
  Departments,
  MainPermissions,
  Sphere,
} from "src/utils/types";

interface BodyTypes {
  enabled?: boolean;
  timer?: number;
  department: Departments;
  sphere_status: Sphere;
  started_at?: string;
  finished_at?: string;
}

export const useStatsBrigada = ({
  enabled = true,
  department,
  sphere_status,
  started_at = dayjs().startOf("month").format("YYYY-MM-DD"),
  finished_at = dayjs().format("YYYY-MM-DD"),
}: BodyTypes) => {
  const permmission = useAppSelector(permissionSelector);
  return useQuery({
    queryKey: [
      "stats_brigada",
      started_at,
      finished_at,
      sphere_status,
      department,
    ],
    queryFn: () =>
      apiClient
        .get("/v1/stats/brigada", {
          department,
          sphere_status,
          started_at,
          finished_at,
        })
        .then(({ data: response }) => {
          return response as DepartmentStatTypes[];
        }),
    enabled: enabled && permmission?.[MainPermissions.get_statistics],
  });
};
export default useStatsBrigada;
