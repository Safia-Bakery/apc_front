import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { Category, CategoryTypes } from "@/utils/types";

interface Props {
  enabled?: boolean;
  size?: number;
  page?: number;
  department?: number | string;
  sub_id?: number | string;
  name?: string;
  category_status?: number | string;
  sphere_status?: number;
  parent_id?: number;
}

export const useCategories = ({ enabled, ...params }: Props) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () =>
      baseApi
        .get("/category", { params })
        .then(({ data: response }) => response as BasePaginateRes<Category>),
    enabled,
    refetchOnMount: true,
  });
};
export default useCategories;
