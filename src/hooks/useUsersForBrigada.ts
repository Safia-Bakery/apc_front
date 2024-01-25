import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { UsersTypes } from "@/utils/types";

export const useUsersForBrigada = ({
  enabled = true,
  id,
  name,
}: {
  enabled?: boolean;
  id: number | string;
  name?: string;
}) => {
  return useQuery({
    queryKey: ["users_for_brigada", id, name],
    queryFn: () =>
      apiClient
        .get(`/users/for/brigada/${id}`, { name })
        .then(({ data: response }) => response as UsersTypes),
    enabled,
    refetchOnMount: true,
  });
};
export default useUsersForBrigada;
