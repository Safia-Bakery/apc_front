import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import {
  InventoryWebAppOrders,
  BasePaginateRes,
  EPresetTimes,
} from "@/utils/types";

interface Props {
  status?: number;
  from_date?: string;
  to_date?: string;
  page?: number;
  size?: number;
  enabled?: boolean;
}

export const useWebInvOrders = ({ enabled, ...params }: Props) => {
  return useQuery({
    queryKey: ["useWebInvOrders", params],
    queryFn: () =>
      baseApi
        .get("/v1/my/orders", { params })
        .then(
          ({ data: response }) =>
            response as BasePaginateRes<InventoryWebAppOrders>
        ),
    enabled,
    refetchOnMount: true,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};
export default useWebInvOrders;
