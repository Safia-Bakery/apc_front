import { useQuery } from "@tanstack/react-query";
import apiClient from "src/main";
import { CategoryTypes } from "src/utils/types";

export const useCategories = ({
  enabled = true,
  size,
  page = 1,
  body,
  department,
  sub_id,
  sphere_status,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
  department?: number | string;
  sub_id?: number | string;
  body?: { name?: string; category_status?: string };
  sphere_status?: number;
}) => {
  return useQuery({
    queryKey: ["categories", page, department, sub_id, sphere_status],
    queryFn: () =>
      apiClient
        .get("/category", {
          size,
          page,
          department,
          sub_id,
          sphere_status,
          ...body,
        })
        .then(({ data: response }) => {
          return response as CategoryTypes;
        }),
    enabled,
    refetchOnMount: true,
  });
};
export default useCategories;
