import { useQuery } from "@tanstack/react-query";
import apiClient from "src/main";
import { useAppDispatch } from "src/redux/utils/types";
import { RoleTypes } from "src/utils/types";

export const useRoles = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["user_role"],
    queryFn: () =>
      apiClient.get(`/user/role`).then(({ data: response }) => {
        return response as RoleTypes[];
      }),
    enabled,
    refetchOnMount: true,
  });
};
export default useRoles;
