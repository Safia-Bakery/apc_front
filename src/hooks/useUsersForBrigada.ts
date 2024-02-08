import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { Departments, Sphere, UsersTypes } from "@/utils/types";

interface Params {
  enabled?: boolean;
  id: number | string;
  name?: string;
  sphere_status?: Sphere;
  department?: Departments;
}

export const useUsersForBrigada = (params: Params) => {
  return useQuery({
    queryKey: ["users_for_brigada", params],
    queryFn: () =>
      apiClient
        .get({ url: `/users/for/brigada/${params.id}`, params })
        .then(({ data: response }) => response as UsersTypes),
    enabled: params.enabled,
    refetchOnMount: true,
  });
};
export default useUsersForBrigada;
