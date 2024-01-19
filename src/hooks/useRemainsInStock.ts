import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { RemainsInStockType } from "@/utils/types";

interface Body {
  enabled?: boolean;
  store_id: number | string;
  page: number;
  size?: number;
  name?: string;
  last_update?: string;
}

export const useRemainsInStock = ({
  store_id,
  enabled = true,
  page,
  name,
  last_update,
}: Body) => {
  return useQuery({
    queryKey: ["remains_in_stock", store_id, page, name, last_update],
    queryFn: () =>
      apiClient
        .get(`/v1/tools/left`, { store_id, page, name, last_update })
        .then(({ data: response }) => (response as RemainsInStockType) || null),
    enabled: !!store_id && enabled,
    refetchOnMount: true,
  });
};
export default useRemainsInStock;
