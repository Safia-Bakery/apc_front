import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/utils/types";
import { CountTypes, EPresetTimes } from "@/utils/types";

export const useOrderCounts = ({ enabled = true }: { enabled?: boolean }) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["order_count"],
    queryFn: ({ signal }) =>
      baseApi
        .get("/v1/department/count", { signal })
        .then(
          ({ data: response }: { data: any }) =>
            response.counter as CountTypes["counter"]
        ),

    enabled: enabled && !!token,
    refetchOnMount: true,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};
export default useOrderCounts;
