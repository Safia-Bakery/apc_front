import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";
import { BranchTypes } from "@/utils/types";

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
  return useQuery({
    queryKey: ["branches_sync"],
    queryFn: () =>
      apiClient
        .get("/synch/department", { page, size }, config)
        .then(({ data: response }) => {
          return response as BranchTypes;
        })
        .catch((e) => errorToast(e.message)),
    enabled,
  });
};
export default useBranchSync;
