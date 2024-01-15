import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/utils/types";
import { InventoryOrder } from "@/utils/types";

interface Body {
  toolorder_id: number;
  enabled?: boolean;
  size?: number;
  page?: number;
}

export const useInventoryOrdersNeeded = (body: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["tools_order_needed", body],
    queryFn: () =>
      apiClient
        .get("/tools/order/needed", body)
        .then(({ data: response }) => response as InventoryOrder),
    enabled: body.enabled && !!token,
    refetchOnMount: true,
  });
};
export default useInventoryOrdersNeeded;
