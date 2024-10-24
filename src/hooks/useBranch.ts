import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { permissionSelector } from "reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import { BranchType } from "@/utils/types";
import { MainPermissions } from "@/utils/permissions";

export const useBranch = ({
  id,
  enabled = true,
}: {
  enabled?: boolean;
  id: number | string;
}) => {
  const perm = useAppSelector(permissionSelector);
  return useQuery({
    queryKey: ["branch", id],
    queryFn: () =>
      baseApi
        .get(`/fillials/${id}`)
        .then(({ data: response }) => (response as BranchType) || null),
    enabled: !!id && enabled && perm?.[MainPermissions.get_fillials_list],
    refetchOnMount: true,
  });
};
export default useBranch;
