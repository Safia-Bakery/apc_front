import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { Departments, Order, ValueLabel } from "@/utils/types";

interface Params {
  enabled?: boolean;
  size?: number;
  page?: number;
  department?: Departments;
  request_status?: string;
  created_at?: string;
  fillial_id?: string;
  user?: string;
  id?: number;
}

export const getInventoryRequests = ({
  enabled,
  department,
  request_status,
  ...params
}: Params) => {
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
          ({ data: response }) => (response as BasePaginateRes<Order>) || null
        ),
    enabled,
  });
};

interface Body {
  id?: number;
  fillial_id: string;
  category_id: number;
  description?: string;
  product?: string;
  expenditure?: {
    amount: number;
    tool_id: number | string;
  }[];
}

const invRequestMutation = () => {
  return useMutation({
    mutationKey: ["cars_mutation"],
    mutationFn: async (body: Body) => {
      if (body.id) {
        const { data } = await baseApi.put("/api/v2/requests/inv", body);
        return data;
      } else {
        const { data } = await baseApi.post("/api/v2/requests/inv", body);
        return data;
      }
    },
  });
};
export default invRequestMutation;
