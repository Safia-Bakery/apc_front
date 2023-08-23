import { useQuery } from "@tanstack/react-query";
import apiClient from "src/main";
import { ToolTypes } from "src/utils/types";

export const useTools = ({
  enabled = true,
  size,
  page = 1,
  query,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
  query?: string;
}) => {
  return useQuery({
    queryKey: ["tools"],
    queryFn: () =>
      apiClient
        .get(!!query ? "/tools/" : "/tools", {
          ...(query && { query }),
          page,
          size,
        })
        .then(({ data: response }) => {
          return response as ToolTypes;
        }),
    enabled,
  });
};
export default useTools;
