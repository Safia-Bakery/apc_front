import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { UsersTypes } from "src/utils/types";

export const useUsers = ({
  enabled = true,
  size = 20,
  page = 1,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () =>
      apiClient
        .get(`/users?size=${size}&page=${page}`)
        .then(({ data: response }) => (response as UsersTypes) || null),
    enabled,
    refetchOnMount: true,
  });
};
export default useUsers;
