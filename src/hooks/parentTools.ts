import { useMutation, useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { EPresetTimes } from "@/utils/types";

interface Props {
  parent_id?: string;
  enabled?: boolean;
  name?: string;
  status?: number;
}

interface Body {
  id?: string;
  status?: number;
}

export const getParentTools = ({ enabled, ...params }: Props) => {
  return useQuery({
    queryKey: ["tools_parents", params],
    queryFn: () =>
      baseApi
        .get("/tools/parents", {
          params,
        })
        .then(({ data: response }) => response as BasePaginateRes<ParentTools>),
    enabled,
    refetchOnMount: true,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};

export const parentToolMutation = () => {
  return useMutation({
    mutationKey: ["parent_tool_mutation"],
    mutationFn: async ({ status, id }: Body) => {
      const { data } = await baseApi.put(
        `/tools/parents?id=${id}&status=${status}`
      );
      return data;
    },
  });
};
