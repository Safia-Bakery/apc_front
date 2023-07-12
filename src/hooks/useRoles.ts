import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { RoleTypes } from "src/utils/types";

export const useRoles = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["user", "role"],
    queryFn: () =>
      apiClient
        .get(`/user/role`)
        .then(({ data: response }) => (response as RoleTypes[]) || []),
    enabled,
    refetchOnMount: true,
  });
};
export default useRoles;
