import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { Order } from "@/utils/types";

export const useOrder = ({
  id,
  enabled = true,
}: {
  enabled?: boolean;
  id: number | string;
}) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () =>
      baseApi
        .get(`/request/${id}`)
        .then(({ data: response }) => (response as Order) || null),
    enabled: !!id && enabled,
    refetchOnMount: true,
  });
};
export default useOrder;
