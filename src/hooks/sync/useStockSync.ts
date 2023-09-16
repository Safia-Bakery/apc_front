import { useQuery } from "@tanstack/react-query";
import apiClient from "src/main";
import { errorToast, successToast } from "src/utils/toast";
import { BranchTypes } from "src/utils/types";

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
        .get("/v1/synch/left", { store_id }, config)
        .then(({ data: response }) => {
          successToast("Синхронизировано");
          return response as BranchTypes;
        })
        .catch((e) => errorToast(e.message)),
    enabled,
  });
};
export default useStockSync;
