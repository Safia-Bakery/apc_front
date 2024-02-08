import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { CategoryProducts } from "@/utils/types";

interface Props {
  enabled?: boolean;
  size?: number;
  page?: number;
  name?: string;
  category_id: string | number;
  id?: string | number;
}

export const useCatProducts = ({ enabled = true, ...params }: Props) => {
  return useQuery({
    queryKey: ["category_products", params],
    queryFn: () =>
      apiClient
        .get({
          url: "/v1/cat/product",
          params,
        })
        .then(({ data: response }) => response as CategoryProducts[]),
    enabled,
    refetchOnMount: true,
  });
};
export default useCatProducts;
