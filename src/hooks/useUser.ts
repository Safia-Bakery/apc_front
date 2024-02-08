import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { UserTypes } from "@/utils/types";

export const useUser = ({
  id,
  enabled = true,
}: {
  enabled?: boolean;
  id: number | string;
}) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () =>
      apiClient
        .get({ url: `/users/${id}` })
        .then(({ data: response }) => (response as UserTypes) || null),
    enabled: !!id && enabled,
    refetchOnMount: true,
  });
};
export default useUser;
