import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { UsersType } from "@/utils/types";

export const useUsersForBrigada = ({
  enabled = true,
  id,
}: {
  enabled?: boolean;
  id: number | string;
}) => {
  return useQuery({
    queryKey: ["users_for_brigada", id],
    queryFn: () =>
      apiClient
        .get(`/users/for/brigada/${id}`)
        .then(({ data: response }) => response as UsersType[]),
    enabled,
    refetchOnMount: true,
  });
};
export default useUsersForBrigada;
