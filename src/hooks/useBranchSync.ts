import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { cachedBranches } from "src/redux/reducers/cache";
import { useAppDispatch } from "src/redux/utils/types";
import { errorToast } from "src/utils/toast";
import { BranchTypes } from "src/utils/types";

const config = { timeout: 100000 };

export const useBranchSync = ({
  enabled = true,
  size,
  page = 1,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
}) => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["branches_sync"],
    queryFn: () =>
      apiClient
        .get("/synch/department", { page, size }, config)
        .then(({ data: response }) => {
          dispatch(cachedBranches(response as BranchTypes));
          return response as BranchTypes;
        })
        .catch((e) => errorToast(e.message)),
    enabled,
  });
};
export default useBranchSync;
