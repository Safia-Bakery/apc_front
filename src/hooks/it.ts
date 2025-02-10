import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { EPresetTimes, Order, ValueLabel } from "@/utils/types";

export const getItrequest = ({
  id,
  enabled,
}: {
  id: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["it_request_v2", id],
    queryFn: ({ signal }) =>
      baseApi
        .get(`/api/v2/requests/it/${id}`, {
          signal,
        })
        .then(({ data: response }) => (response as ITRequestRes) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const getITRequests = ({
  enabled,
  request_status,
  ...params
}: ItrequestsParams) => {
  return useQuery({
    queryKey: ["it_requests", params, request_status],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/requests/it", {
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
        .then(
          ({ data: response }) => (response as BasePaginateRes<Order>) || null
        ),
    enabled,
  });
};

export const getCctvRequests = ({
  enabled,
  request_status,
  ...params
}: ItrequestsParams) => {
  return useQuery({
    queryKey: ["cctv_it_requests", params, request_status],
    queryFn: ({ signal }) =>
      baseApi
        .get("/api/v2/requests/video", {
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
        .then(
          ({ data: response }) => (response as BasePaginateRes<Order>) || null
        ),
    enabled,
  });
};

export const itRequestMutation = () => {
  return useMutation({
    mutationKey: ["it_request_mutation"],
    mutationFn: async (body: ITrequestBody) => {
      if (body.request_id) {
        const { data } = await baseApi.put(
          `/api/v2/requests/it/${body.request_id}`,
          body
        );
        return data;
      } else {
        const { data } = await baseApi.post("/api/v2/requests/it", body);
        return data;
      }
    },
  });
};
