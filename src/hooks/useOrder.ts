import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
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
      apiClient
        .get(`/request/${id}`)
        .then(({ data: response }) => (response as Order) || null),
    enabled: !!id && enabled,
    refetchOnMount: true,
  });
};
export default useOrder;
