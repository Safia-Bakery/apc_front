import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { RoleTypes } from "@/utils/types";

export const useRoles = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["user_role"],
    queryFn: () =>
      apiClient
        .get({ url: "/user/role" })
        .then(({ data: response }) => response as RoleTypes[]),
    enabled,
    refetchOnMount: true,
  });
};
export default useRoles;
