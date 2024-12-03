import baseApi from "@/api/base_api";
import { EPresetTimes } from "@/utils/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const freezerRequestMutation = () => {
  return useMutation({
    mutationKey: ["frezer_request_mutation"],
    mutationFn: async ({ id, ...body }: FreezerBody) => {
      if (id) {
        const { data } = await baseApi.put(`/collector/order/${id}`, null, {
          params: body,
        });
        return data;
      } else {
        const { data } = await baseApi.post("/collector/order/", body);
        return data;
      }
    },
  });
};

export const getFreezerRequest = ({
  id,
  enabled,
}: {
  id: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["freezer_request", id],
    queryFn: ({ signal }) =>
      baseApi
        .get(`/collector/order/${id}`, {
          signal,
        })
        .then(({ data: response }) => (response as FreezerOrderRes) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const getFreezerBalances = ({
  id,
  enabled,
}: {
  id: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["freezer_tool_balances", id],
    queryFn: ({ signal }) =>
      baseApi
        .get(`/api/v2/tools/balances/${id}`, {
          signal,
        })
        .then(({ data: response }) => (response as FreezerBalancesRes) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
    retry: false,
  });
};

export const freezerBalanceMutation = () => {
  return useMutation({
    mutationKey: ["balance_mutation"],
    mutationFn: async (body: FreezerBalancesBody) => {
      const { data } = await baseApi.put("/api/v2/tools/balances", body);
      return data;
    },
  });
};
