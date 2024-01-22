import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/utils/types";
import { Departments, MainStatTypes, Sphere } from "@/utils/types";

interface Body {
  department: Departments;
  sphere_status?: Sphere;
  enabled?: boolean;
}

export const useMainStats = (body: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["main_statistics", body],
    queryFn: () =>
      apiClient
        .get("/v1/stats/main", body)
        .then(({ data: response }) => response as MainStatTypes),
    enabled: body.enabled && !!token,
  });
};
export default useMainStats;
