import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast, successToast } from "@/utils/toast";
import { BranchTypes } from "@/utils/types";

const config = { timeout: 100000 };

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
      apiClient
        .get({ url: "/v1/synch/left", params: { store_id }, config })
        .then(({ data: response }) => {
          successToast("Синхронизировано");
          response as BranchTypes;
        })
        .catch((e) => errorToast(e.message)),
    enabled,
  });
};
export default useStockSync;
