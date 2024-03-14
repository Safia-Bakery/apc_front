import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { OrderType } from "@/utils/types";

interface Body {
  enabled?: boolean;
  size?: number;
  page?: number;
  sub_id?: number | string;
  department?: number | string;
  sphere_status?: number;
  is_bot?: boolean;
  arrival_date?: string;
  category_id?: number;
  urgent?: boolean;
  fillial_id?: string;
  created_at?: string;
  request_status?: number[];
  user?: string;
  id?: string | number;
  rate?: boolean;
  brigada_id?: number;
}

export const useOrders = ({ enabled, request_status, ...params }: Body) => {
  return useQuery({
    queryKey: ["requests", params],
    queryFn: () =>
      apiClient
        .get({ url: "/request", params, body: request_status })
        .then(({ data: response }) => (response as OrderType) || null),
    enabled,
  });
};
export default useOrders;
