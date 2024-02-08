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

export const useMainStats = ({ enabled, ...params }: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["main_statistics", params],
    queryFn: () =>
      apiClient
        .get({ url: "/v1/stats/main", params })
        .then(({ data: response }) => response as MainStatTypes),
    enabled: enabled && !!token,
  });
};
export default useMainStats;
