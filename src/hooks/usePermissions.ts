import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { PermissionTypes } from "src/utils/types";

export const usePermissions = ({ enabled = false }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["all_permissions"],
    queryFn: () =>
      apiClient
        .get(`/all/permissions`)
        .then(({ data: response }) => (response as PermissionTypes[]) || []),
    enabled,
  });
};
export default usePermissions;
