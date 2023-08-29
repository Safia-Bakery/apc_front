import { useQuery } from "@tanstack/react-query";
import apiClient from "src/main";
import { OrderType, RequestFilter } from "src/utils/types";

export const useOrders = ({
  enabled = true,
  size,
  page = 1,
  sub_id,
  body,
  department,
  sphere_status,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
  sub_id?: number | string;
  department?: number | string;
  body?: RequestFilter;
  sphere_status?: number;
}) => {
  return useQuery({
    queryKey: ["requests", page, sub_id, department, sphere_status],
    queryFn: () =>
      apiClient
        .get("/request", {
          ...body,
          page,
          size,
          sub_id,
          department,
          sphere_status,
        })
        .then(({ data: response }) => (response as OrderType) || null),
    enabled,
    // refetchOnMount: true,
  });
};
export default useOrders;
