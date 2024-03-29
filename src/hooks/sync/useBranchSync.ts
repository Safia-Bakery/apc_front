import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";
import { BranchTypes, EPresetTimes } from "@/utils/types";

const config = { timeout: EPresetTimes.MINUTE * 2 };

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
        .get({ url: "/synch/department", params: { page, size }, config })
        .then(({ data: response }) => {
          return response as BranchTypes;
        })
        .catch((e) => errorToast(e.message)),
    enabled,
  });
};
export default useBranchSync;
