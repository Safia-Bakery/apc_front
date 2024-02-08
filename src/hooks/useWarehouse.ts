import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { BranchTypes } from "@/utils/types";

type Params = {
  enabled?: boolean;
  size?: number;
  page?: number;
};
export const useWarehouse = (params: Params) => {
  return useQuery({
    queryKey: ["warehouse", params],
    queryFn: () =>
      apiClient
        .get({ url: "/get/fillial/fabrica", params })
        .then(({ data: response }) => {
          return response as BranchTypes;
        }),
    enabled: params.enabled,
  });
};
export default useWarehouse;
