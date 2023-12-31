import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { CategoryTypes } from "@/utils/types";

interface Props {
  enabled?: boolean;
  size?: number;
  page?: number;
  department?: number | string;
  sub_id?: number | string;
  body?: { name?: string; category_status?: string };
  sphere_status?: number;
}

export const useCategories = ({
  enabled = true,
  size,
  page = 1,
  body,
  department,
  sub_id,
  sphere_status,
}: Props) => {
  return useQuery({
    queryKey: ["categories", department, sphere_status, page, sub_id],
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
        .then(({ data: response }) => response as CategoryTypes),
    enabled,
    refetchOnMount: true,
  });
};
export default useCategories;
