import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import successToast from "@/utils/successToast";
import errorToast from "@/utils/errorToast";
import { EPresetTimes } from "@/utils/types";

export const useSyncExpanditure = ({
  enabled = true,
}: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["expanditure_sync"],
    queryFn: () =>
      baseApi
        .get("/synch/groups", { timeout: EPresetTimes.MINUTE * 4 })
        .then((response) => {
          if (response?.status === 200) {
            successToast("Синхронизирован");
            return response.data;
          }
        })
        .catch((e) => errorToast(e.message)),
    enabled,
  });
};
export default useSyncExpanditure;
