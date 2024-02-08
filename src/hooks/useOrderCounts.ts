import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/utils/types";
import { CountTypes } from "@/utils/types";

export const useOrderCounts = ({ enabled = true }: { enabled?: boolean }) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["order_count"],
    queryFn: () =>
      apiClient
        .get({ url: "/v1/department/count" })
        .then(
          ({ data: response }: { data: any }) =>
            response.counter as CountTypes["counter"]
        ),
    enabled: enabled && !!token,
    refetchOnMount: true,
  });
};
export default useOrderCounts;
