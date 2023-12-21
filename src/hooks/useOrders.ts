import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { OrderType, RequestFilter } from "@/utils/types";

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
  request_status?: string;
  user?: string;
  id?: string | number;
}

export const useOrders = ({
  enabled = true,
  size,
  page = 1,
  sub_id,
  department,
  sphere_status,
  is_bot,
  arrival_date,
  category_id,
  urgent,
  fillial_id,
  created_at,
  request_status,
  user,
  id,
}: Body) => {
  return useQuery({
    queryKey: [
      "requests",
      page,
      sub_id,
      department,
      sphere_status,
      arrival_date,
      category_id,
      urgent,
      fillial_id,
      created_at,
      request_status,
      user,
      id,
    ],
    queryFn: () =>
      apiClient
        .get("/request", {
          page,
          size,
          sub_id,
          department,
          sphere_status,
          is_bot,
          arrival_date,
          category_id,
          urgent,
          fillial_id,
          created_at,
          request_status,
          user,
          id,
        })
        .then(({ data: response }) => (response as OrderType) || null),
    enabled,
    // refetchOnMount: true,
  });
};
export default useOrders;
