import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { OrderType, ValueLabel } from "@/utils/types";

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
  rate?: boolean;
  brigada_id?: number;
  started_at?: string;
  finished_at?: string;
}

export const useOrders = ({ enabled, request_status, ...params }: Body) => {
  return useQuery({
    queryKey: ["requests", params, request_status],
    queryFn: ({ signal }) =>
      baseApi
        .get("/request", {
          params: {
            ...params,
            ...(!!request_status &&
              (JSON.parse(request_status) as ValueLabel[])?.length && {
                request_status: (JSON.parse(request_status) as ValueLabel[])
                  .map((item) => item.value)
                  .join(","),
              }),
          },
          signal,
        })
        .then(({ data: response }) => (response as OrderType) || null),
    enabled,
  });
};
export default useOrders;
