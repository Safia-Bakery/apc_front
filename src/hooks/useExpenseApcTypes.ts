import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { ExpenseCategoriesTypes } from "@/utils/types";

interface Params {
  enabled?: boolean;
  id?: number | string;
  name?: string;
  status?: string | number;
}

export const useExpenseApcTypes = ({ enabled = true, ...params }: Params) => {
  return useQuery({
    queryKey: ["expense_types", params],
    queryFn: () =>
      apiClient
        .get({ url: "/v1/expense/type", params })
        .then(
          ({ data: response }) => (response as ExpenseCategoriesTypes[]) || null
        ),
    enabled,
    refetchOnMount: true,
  });
};
export default useExpenseApcTypes;
