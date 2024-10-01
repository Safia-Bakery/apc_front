import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { ToolsEarchType } from "@/utils/types";

interface Props {
  parent_id?: string;
  enabled?: boolean;
  name?: string;
}

export const useToolsIerarch = ({ parent_id, enabled, name }: Props) => {
  return useQuery({
    queryKey: ["tools_ierarch", parent_id, name],
    queryFn: () =>
      baseApi
        .get("/tool/iarch", {
          params: {
            parent_id,
            name,
          },
        })
        .then(({ data: response }) => response as ToolsEarchType),
    enabled,
    refetchOnMount: true,
  });
};
export default useToolsIerarch;

//productsIerarch
