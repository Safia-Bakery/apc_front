import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
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
      baseApi
        .get("/v1/cat/product", { params })
        .then(({ data: response }) => response as CategoryProducts[]),
    enabled,
    refetchOnMount: true,
  });
};
export default useCatProducts;
