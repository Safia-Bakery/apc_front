import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { OrderType, RequestFilter } from "src/utils/types";

export const useOrders = ({
  enabled = true,
  size,
  page,
  body,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
  body?: RequestFilter;
}) => {
  return useQuery({
    queryKey: ["requests"],
    queryFn: () =>
      apiClient
        .get("/request", { ...body, page, size })
        .then(({ data: response }) => (response as OrderType) || null),
    enabled,
    // refetchOnMount: true,
  });
};
export default useOrders;
