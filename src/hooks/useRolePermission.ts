import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { RolePermissions } from "src/utils/types";

export const useRolePermission = ({
  id,
  enabled = true,
}: {
  enabled?: boolean;
  id: number | string;
}) => {
  return useQuery({
    queryKey: ["role_permissions", id],
    queryFn: () =>
      apiClient
        .get(`/user/group/permissions/${id}`)
        .then(({ data: response }) => (response as RolePermissions) || null),
    enabled,
    refetchOnMount: true,
  });
};
export default useRolePermission;
