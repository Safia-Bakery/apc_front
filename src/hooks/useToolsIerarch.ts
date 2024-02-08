import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { ToolsEarchType } from "@/utils/types";

interface Props {
  parent_id?: string;
  enabled?: boolean;
}

export const useToolsIerarch = ({ parent_id, enabled }: Props) => {
  return useQuery({
    queryKey: ["tools_ierarch", parent_id],
    queryFn: () =>
      apiClient
        .get({
          url: "/tool/iarch",
          params: {
            parent_id,
          },
        })
        .then(({ data: response }) => response as ToolsEarchType),
    enabled,
    refetchOnMount: true,
  });
};
export default useToolsIerarch;

//productsIerarch
