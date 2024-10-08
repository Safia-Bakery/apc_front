import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/utils/types";
import { InventoryOrders } from "@/utils/types";

interface Body {
  status?: number;
  enabled?: boolean;
  size?: number;
  page?: number;
  id?: number;
}

export const useInventoryOrders = (params: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["toolsorder", params],
    queryFn: () =>
      baseApi
        .get("/toolsorder", { params })
        .then(({ data: response }) => response as InventoryOrders),
    enabled: params.enabled && !!token,
    refetchOnMount: true,
  });
};
export default useInventoryOrders;
