import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { RemainsInStockType } from "@/utils/types";

interface Body {
  enabled?: boolean;
  store_id: number | string;
  page: number;
  size?: number;
  name?: string;
  last_update?: string;
}

export const useRemainsInStock = ({ enabled, ...params }: Body) => {
  return useQuery({
    queryKey: ["remains_in_stock", params],
    queryFn: () =>
      baseApi
        .get("/v1/tools/left", { params })
        .then(({ data: response }) => (response as RemainsInStockType) || null),
    enabled,
    refetchOnMount: true,
  });
};
export default useRemainsInStock;
