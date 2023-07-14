import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { cachedBranches } from "src/redux/reducers/cacheResources";
import { useAppDispatch } from "src/redux/utils/types";
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
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["branches"],
    queryFn: () =>
      apiClient
        .get(`/fillials?size=${size}&page=${page}`)
        .then(({ data: response }) => {
          dispatch(cachedBranches(response as BranchTypes));
          return response as BranchTypes;
        }),
    enabled,
  });
};
export default useBranches;
