import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { PermissionTypes } from "@/utils/types";

export const usePermissions = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["all_permissions"],
    queryFn: () =>
      baseApi.get("/all/permissions").then(({ data: response }) => {
        return (response as PermissionTypes[]) || [];
      }),
    enabled,
  });
};
export default usePermissions;
