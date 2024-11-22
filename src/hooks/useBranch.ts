import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { BranchType } from "@/utils/types";

export const useBranch = ({
  id,
  enabled = true,
}: {
  enabled?: boolean;
  id: number | string;
}) => {
  return useQuery({
    queryKey: ["branch", id],
    queryFn: () =>
      baseApi
        .get(`/fillials/${id}`)
        .then(({ data: response }) => (response as BranchType) || null),
    enabled: !!id && enabled,
    refetchOnMount: true,
  });
};
export default useBranch;
