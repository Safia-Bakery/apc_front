import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import errorToast from "@/utils/errorToast";
import { BranchTypes, EPresetTimes } from "@/utils/types";

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
      baseApi
        .get("/synch/department", {
          params: { page, size },
          timeout: EPresetTimes.MINUTE * 5,
        })
        .then(({ data: response }) => {
          return response as BranchTypes;
        })
        .catch((e) => errorToast(e.message)),
    enabled,
  });
};
export default useBranchSync;
