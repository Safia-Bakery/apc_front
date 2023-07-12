import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { BranchTypes } from "src/utils/types";

export const useBranches = ({
  enabled = true,
  size = 20,
  page = 1,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["branches"],
    queryFn: () =>
      apiClient
        .get(`/fillials?size=${size}&page=${page}`)
        .then(({ data: response }) => (response as BranchTypes) || null),
    enabled,
  });
};
export default useBranches;
