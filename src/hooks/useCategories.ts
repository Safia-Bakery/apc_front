import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { CategoryTypes } from "src/utils/types";

export const useCategories = ({
  enabled = true,
  size = 20,
  page = 1,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      apiClient
        .get(`/category?size=${size}&page=${page}`)
        .then(({ data: response }) => (response as CategoryTypes) || null),
    enabled,
  });
};
export default useCategories;
