import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { BranchType } from "src/utils/types";

export const useBranch = ({
  id,
  enabled = true,
}: {
  enabled?: boolean;
  id: number;
}) => {
  return useQuery({
    queryKey: ["branch", id],
    queryFn: () =>
      apiClient
        .get(`/fillials/${id}`)
        .then(({ data: response }) => (response as BranchType) || null),
    enabled: !!id && enabled,
    refetchOnMount: true,
  });
};
export default useBranch;
