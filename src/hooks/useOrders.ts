import { useQuery } from "@tanstack/react-query";
import apiClient from "src/api/baseAxios";
import { OrderType } from "src/utils/types";

export const useOrders = ({
  history = false,
  enabled = true,
  size = 5,
  page = 1,
}: {
  history?: boolean;
  enabled?: boolean;
  size?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["orders", history],
    queryFn: () =>
      apiClient
        .get(
          `/get/${history ? "done/" : ""}order/list?size=${size}&page=${page}`
        )
        .then(({ data: response }) => (response as OrderType) || null),
    enabled,
  });
};
export default useOrders;
