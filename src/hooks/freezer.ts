import baseApi from "@/api/base_api";
import { EPresetTimes } from "@/utils/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const freezerRequestMutation = () => {
  return useMutation({
    mutationKey: ["cars_mutation"],
    mutationFn: async ({ ...body }: FreezerBody) => {
      if (body.id) {
        const { data } = await baseApi.put(
          `/collector/order/${body.id}?status=${body.status}`
        );
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