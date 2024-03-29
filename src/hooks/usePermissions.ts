import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { PermissionTypes } from "@/utils/types";

export const usePermissions = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["all_permissions"],
    queryFn: () =>
      apiClient.get({ url: "/all/permissions" }).then(({ data: response }) => {
        return (response as PermissionTypes[]) || [];
      }),
    enabled,
  });
};
export default usePermissions;
