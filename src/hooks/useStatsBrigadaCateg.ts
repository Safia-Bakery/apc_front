import { useQuery } from "@tanstack/react-query";
import apiClient from "src/main";
import { permissionSelector } from "src/store/reducers/sidebar";
import { useAppSelector } from "src/store/utils/types";
import dayjs from "dayjs";
import {
  BrigadaCategStatTypes,
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

export const useStatsBrigadaCateg = ({
  enabled = true,
  department,
  sphere_status,
  started_at = dayjs().startOf("month").format("YYYY-MM-DD"),
  finished_at = dayjs().format("YYYY-MM-DD"),
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
    queryFn: () =>
      apiClient
        .get("/v1/stats/brigada/category", {
          department,
          sphere_status,
          started_at,
          finished_at,
          timer,
        })
        .then(({ data: response }) => {
          return response as BrigadaCategStatTypes;
        }),
    enabled: enabled && permmission?.[MainPermissions.get_statistics],
  });
};
export default useStatsBrigadaCateg;
