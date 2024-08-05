import { BasePaginateRes, EPresetTimes, ToolItemType } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";

interface Props {
  category_id?: number;
  id?: number;
  page?: number;
  size?: number;
  enabled?: boolean;
}

export const useInvTools = ({ enabled, ...params }: Props) => {
  return useQuery({
    queryKey: ["useInvTools", params],
    queryFn: () =>
      apiClient
        .get({
          url: "/v1/category/tools",
          params,
        })
        .then(
          ({ data: response }) => response as BasePaginateRes<ToolItemType>
        ),
    staleTime: EPresetTimes.MINUTE * 4,
    refetchOnMount: true,
    enabled,
  });
};
