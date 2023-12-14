import { useQuery } from "@tanstack/react-query";
import apiClient from "src/main";
import { CoountTypes } from "src/utils/types";

export const useOrderCounts = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["order_count"],
    queryFn: () =>
      apiClient
        .get("/v1/department/count")
        .then(
          ({ data: response }: { data: any }) =>
            response.counter as CoountTypes["counter"]
        ),
    enabled,
    refetchOnMount: true,
  });
};
export default useOrderCounts;
