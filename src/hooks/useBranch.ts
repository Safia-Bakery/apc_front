import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { permissionSelector } from "reducers/sidebar";
import { useAppSelector } from "@/store/utils/types";
import { BranchType, MainPermissions } from "@/utils/types";

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
      apiClient
        .get({ url: `/fillials/${id}` })
        .then(({ data: response }) => (response as BranchType) || null),
    enabled: !!id && enabled && perm?.[MainPermissions.get_fillials_list],
    refetchOnMount: true,
  });
};
export default useBranch;
