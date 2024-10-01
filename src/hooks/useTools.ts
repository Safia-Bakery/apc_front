import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
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
      baseApi
        .get("/tools/", { params, ...config })
        .then(({ data: response }) => {
          return response as ToolTypes;
        }),
    enabled,
  });
};
export default useTools;
