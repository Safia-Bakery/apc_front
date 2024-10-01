import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { Category } from "@/utils/types";

export const useCategory = ({
  id,
  enabled = true,
}: {
  enabled?: boolean;
  id: number | string;
}) => {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () =>
      baseApi
        .get(`/category/${id}`)
        .then(({ data: response }) => (response as Category) || null),
    enabled: !!id && enabled,
    refetchOnMount: true,
  });
};
export default useCategory;
