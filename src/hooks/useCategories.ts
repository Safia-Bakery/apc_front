import { useMutation, useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { Category } from "@/utils/types";

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
  staleTime?: number;
  page_name?: string;
}

export const useCategories = ({ enabled, staleTime, ...params }: Props) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () =>
      baseApi
        .get("/category", { params })
        .then(({ data: response }) => response as BasePaginateRes<Category>),
    enabled,
    refetchOnMount: true,
    staleTime,
  });
};

export const loadCategoriesChild = () => {
  return useMutation({
    mutationKey: ["category_child"],
    mutationFn: async (body: { parent_id: number; page_name?: string }) => {
      const { data } = await baseApi.get("/category", {
        params: { ...body, status: 1 },
      });
      return data as BasePaginateRes<Category>;
    },
  });
};
export default useCategories;
