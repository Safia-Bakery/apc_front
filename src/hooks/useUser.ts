import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { UserTypes } from "src/utils/types";

export const useUser = ({
  id,
  enabled = true,
}: {
  enabled?: boolean;
  id: number;
}) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () =>
      apiClient
        .get(`/users/${id}`)
        .then(({ data: response }) => (response as UserTypes) || null),
    enabled: !!id && enabled,
    refetchOnMount: true,
  });
};
export default useUser;
