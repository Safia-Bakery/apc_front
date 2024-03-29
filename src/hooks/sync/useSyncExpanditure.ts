import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast, successToast } from "@/utils/toast";
import { EPresetTimes } from "@/utils/types";

const config = { timeout: EPresetTimes.MINUTE * 2 };

export const useSyncExpanditure = ({
  enabled = true,
}: {
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["expanditure_sync"],
    queryFn: () =>
      apiClient
        .get({ url: "/synch/groups", config })
        .then((response) => {
          if (response.status === 200) {
            successToast("Синхронизирован");
            return response.data;
          }
        })
        .catch((e) => errorToast(e.message)),
    enabled,
  });
};
export default useSyncExpanditure;
