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
}

export const useTools = ({
  enabled = true,
  size,
  page = 1,
  name,
  department,
  id,
}: Body) => {
  return useQuery({
    queryKey: ["tools", name, department, page],
    queryFn: () =>
      apiClient
        .get("/tools/", {
          name,
          department,
          id,
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
