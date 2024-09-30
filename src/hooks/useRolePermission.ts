import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { RolePermissions } from "@/utils/types";

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
      baseApi
        .get(`/user/group/permissions/${id}`)
        .then(({ data: response }) => (response as RolePermissions) || null),
    enabled,
    refetchOnMount: true,
  });
};
export default useRolePermission;
