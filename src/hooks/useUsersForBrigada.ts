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

export const useUsersForBrigada = ({
  enabled = true,
  id,
  name,
  sphere_status,
  department,
}: Params) => {
  return useQuery({
    queryKey: ["users_for_brigada", id, name, sphere_status, department],
    queryFn: () =>
      apiClient
        .get(`/users/for/brigada/${id}`, { name, sphere_status, department })
        .then(({ data: response }) => response as UsersTypes),
    enabled,
    refetchOnMount: true,
  });
};
export default useUsersForBrigada;
