import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { cachedBranches } from "src/redux/reducers/cache";
import { useAppDispatch } from "src/redux/utils/types";
import { BranchTypes } from "src/utils/types";

interface BodyTypes {
  name?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  fillial_status?: number | string;
}

export const useBranches = ({
  enabled = true,
  size,
  page = 1,
  body,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
  body?: BodyTypes;
}) => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["branches", page],
    queryFn: () =>
      apiClient
        .get("/fillials", { page, size, ...body })
        .then(({ data: response }) => {
          dispatch(cachedBranches(response as BranchTypes));
          return response as BranchTypes;
        }),
    enabled,
  });
};
export default useBranches;
