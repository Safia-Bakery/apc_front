import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { RemainsInStockType } from "@/utils/types";

export const useRemainsInStock = ({
  store_id,
  enabled = true,
  page,
  size,
}: {
  enabled?: boolean;
  store_id: number | string;
  page: number;
  size?: number;
}) => {
  return useQuery({
    queryKey: ["remains_in_stock", store_id, page],
    queryFn: () =>
      apiClient
        .get(`/v1/tools/left`, { store_id, page, size })
        .then(({ data: response }) => (response as RemainsInStockType) || null),
    enabled: !!store_id && enabled,
    refetchOnMount: true,
  });
};
export default useRemainsInStock;
