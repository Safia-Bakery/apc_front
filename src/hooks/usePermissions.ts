import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { cachedPermissions } from "src/redux/reducers/cacheResources";
import { useAppDispatch } from "src/redux/utils/types";
import { PermissionTypes } from "src/utils/types";

export const usePermissions = ({ enabled = false }: { enabled?: boolean }) => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["all_permissions"],
    queryFn: () =>
      apiClient.get(`/all/permissions`).then(({ data: response }) => {
        dispatch(cachedPermissions(response as PermissionTypes[]));
        return (response as PermissionTypes[]) || [];
      }),
    enabled,
  });
};
export default usePermissions;
