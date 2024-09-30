import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { RoleTypes } from "@/utils/types";

export const useRoles = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["user_role"],
    queryFn: () =>
      baseApi
        .get("/user/role")
        .then(({ data: response }) => response as RoleTypes[]),
    enabled,
    refetchOnMount: true,
  });
};
export default useRoles;
