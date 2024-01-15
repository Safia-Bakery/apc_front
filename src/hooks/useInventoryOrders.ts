import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/utils/types";
import { InventoryOrders } from "@/utils/types";

interface Body {
  status?: number;
  enabled?: boolean;
  size?: number;
  page?: number;
}

export const useInventoryOrders = (body: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["toolsorder", body],
    queryFn: () =>
      apiClient
        .get("/toolsorder", body)
        .then(({ data: response }) => response as InventoryOrders),
    enabled: body.enabled && !!token,
    refetchOnMount: true,
  });
};
export default useInventoryOrders;
