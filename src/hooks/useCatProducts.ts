import { useQuery } from "@tanstack/react-query";
import apiClient from "src/main";
import { CategoryProducts } from "src/utils/types";

interface Props {
  enabled?: boolean;
  size?: number;
  page?: number;
  name?: string;
  category_id: string | number;
  id?: string | number;
}

export const useCatProducts = ({
  enabled = true,
  size,
  page = 1,
  name,
  category_id,
  id,
}: Props) => {
  return useQuery({
    queryKey: ["category_products", page, name, category_id, id],
    queryFn: () =>
      apiClient
        .get("/v1/cat/product", {
          size,
          page,
          name,
          category_id,
          id,
        })
        .then(({ data: response }) => response as CategoryProducts[]),
    enabled,
    refetchOnMount: true,
  });
};
export default useCatProducts;
