import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { Departments, EPresetTimes, ToolTypes } from "@/utils/types";

interface Body {
  enabled?: boolean;
  size?: number;
  page?: number;
  name?: string | null;
  department?: Departments;
  id?: string;
  few_amounts?: boolean;
}

const config = { timeout: EPresetTimes.MINUTE * 5 };

export const useTools = ({ enabled = true, ...params }: Body) => {
  return useQuery({
    queryKey: ["tools", params],
    queryFn: () =>
      apiClient
        .get({
          url: "/tools/",
          params,
          config,
        })
        .then(({ data: response }) => {
          return response as ToolTypes;
        }),
    enabled,
  });
};
export default useTools;
