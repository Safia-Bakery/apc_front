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

export const useTools = ({
  enabled = true,
  size,
  page,
  name,
  department,
  few_amounts,
  id,
}: Body) => {
  return useQuery({
    queryKey: ["tools", name, department, page, id, few_amounts],
    queryFn: () =>
      apiClient
        .get("/tools/", {
          name,
          department,
          id,
          page,
          size,
          few_amounts,
        })
        .then(({ data: response }) => {
          return response as ToolTypes;
        }),
    enabled,
  });
};
export default useTools;
