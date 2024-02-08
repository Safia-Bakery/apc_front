import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { Departments, ToolTypes } from "@/utils/types";

interface Body {
  enabled?: boolean;
  size?: number;
  page?: number;
  name?: string | null;
  department?: Departments;
  id?: string;
  few_amounts?: boolean;
}

export const useTools = ({ enabled = true, ...params }: Body) => {
  return useQuery({
    queryKey: ["tools", params],
    queryFn: () =>
      apiClient
        .get({
          url: "/tools/",
          params,
        })
        .then(({ data: response }) => {
          return response as ToolTypes;
        }),
    enabled,
  });
};
export default useTools;
