import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import { BranchTypes, EPresetTimes } from "@/utils/types";

export const useStockSync = ({
  enabled = true,
  store_id,
}: {
  enabled?: boolean;
  store_id: string;
}) => {
  return useQuery({
    queryKey: ["stock_sync"],
    queryFn: () =>
      baseApi
        .get("/v1/synch/left", {
          params: { store_id },
          timeout: EPresetTimes.MINUTE * 5,
        })
        .then(({ data: response }) => {
          successToast("Синхронизировано");
          response as BranchTypes;
        })
        .catch((e) => errorToast(e.message)),
    enabled,
  });
};
export default useStockSync;
