import { useQuery } from "@tanstack/react-query";
import apiClient from "src/main";
import { tokenSelector } from "src/store/reducers/auth";
import { useAppSelector } from "src/store/utils/types";
import { CountTypes } from "src/utils/types";

export const useOrderCounts = ({ enabled = true }: { enabled?: boolean }) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["order_count"],
    queryFn: () =>
      apiClient
        .get("/v1/department/count")
        .then(
          ({ data: response }: { data: any }) =>
            response.counter as CountTypes["counter"]
        ),
    enabled: enabled && !!token,
    refetchOnMount: true,
  });
};
export default useOrderCounts;
