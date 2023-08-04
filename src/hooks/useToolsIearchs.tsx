import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { ToolsEarchType } from "src/utils/types";

export const useToolsIearchs = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["tools_iearchs"],
    queryFn: () =>
      apiClient.get("/tool/iarch").then(({ data: response }) => {
        return response as ToolsEarchType[];
      }),
    enabled,
  });
};
export default useToolsIearchs;
