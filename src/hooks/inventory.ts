import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { Departments, EPresetTimes, ValueLabel } from "@/utils/types";

export const getInventoryRequests = ({
  enabled,
  department,
  request_status,
  ...params
}: InventoryReqParams) => {
  return useQuery({
    queryKey: ["inventory_requests", params, department, request_status],
    queryFn: ({ signal }) =>
      baseApi
        .get(
          department === Departments.inventory_factory
            ? "/api/v2/requests/inv/factory"
            : "/api/v2/requests/inv/retail",
          {
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
          }
        )
        .then(
          ({ data: response }) =>
            (response as BasePaginateRes<InventoryReqsRes>) || null
        ),
    enabled,
  });
};

export const invRequestMutation = () => {
  return useMutation({
    mutationKey: ["inv_request_mutation"],
    mutationFn: async ({ department, ...body }: InventoryRequestBody) => {
      if (body.id) {
        const { data } = await baseApi.put(
          `/api/v2/requests/inv/${
            department === Departments.inventory_factory ? "factory" : ""
          }`,
          body
        );
        return data;
      } else {
        const { data } = await baseApi.post(
          `/api/v2/requests/inv/${
            department === Departments.inventory_factory ? "factory" : "retail"
          }`,
          body
        );
        return data;
      }
    },
  });
};

export const getInvRequest = ({
  id,
  enabled,
  department,
}: {
  id: number;
  department: number;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["inv_request", id],
    queryFn: ({ signal }) =>
      baseApi
        .get(
          department === Departments.inventory_retail
            ? `/api/v2/requests/inv/${id}`
            : `/api/v2/requests/inv/factory/${id}`,
          {
            signal,
          }
        )
        .then(({ data: response }) => (response as InventoryReqRes) || null),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};
