import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
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
      baseApi
        .get(`/users/${id}`)
        .then(({ data: response }) => (response as UserTypes) || null),
    enabled: !!id && enabled,
    refetchOnMount: true,
  });
};
export default useUser;
