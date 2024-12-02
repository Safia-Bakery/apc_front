import baseApi from "@/api/base_api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const getCoins = ({ enabled, ...params }: CoinParams) => {
  return useQuery({
    queryKey: ["get_coin_requests", params],
    queryFn: ({ signal }) =>
      baseApi
        .get("/coins", {
          params,
          signal,
        })
        .then(
          ({ data: response }) => (response as BasePaginateRes<CoinRes>) || null
        ),
    enabled,
  });
};

export const getCoin = ({ enabled, id }: { enabled?: boolean; id: number }) => {
  return useQuery({
    queryKey: ["get_coin_request", id],
    queryFn: ({ signal }) =>
      baseApi
        .get(`/coins/${id}`, {
          signal,
        })
        .then(({ data: response }) => (response as CoinRes) || null),
    enabled,
  });
};

export const editCoinRequest = () => {
  return useMutation({
    mutationKey: ["coin_request_mutation"],
    mutationFn: async ({ id, ...body }: CoinBody) => {
      const { data } = await baseApi.put(`/coins/${id}`, body);
      return data;
    },
  });
};
