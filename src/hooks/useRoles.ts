import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { roleSelector, tokenSelector } from "src/redux/reducers/authReducer";
import { cachedRoles } from "src/redux/reducers/cacheResources";
import { useAppDispatch, useAppSelector } from "src/redux/utils/types";
import { RoleTypes } from "src/utils/types";

export const useRoles = ({ enabled = true }: { enabled?: boolean }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(roleSelector);
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["user", "role"],
    queryFn: () =>
      apiClient.get(`/user/role`).then(({ data: response }) => {
        dispatch(cachedRoles(response as RoleTypes[]));
        return response as RoleTypes[];
      }),
    enabled: !!token && !!user?.permissions.roles && enabled,
    refetchOnMount: true,
  });
};
export default useRoles;
