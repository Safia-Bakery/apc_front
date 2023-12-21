import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
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
      apiClient
        .get(`/category/${id}`)
        .then(({ data: response }) => (response as Category) || null),
    enabled: !!id && enabled,
    refetchOnMount: true,
  });
};
export default useCategory;
