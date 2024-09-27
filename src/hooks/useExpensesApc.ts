import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { ExpensesTypes } from "@/utils/types";

interface Params {
  enabled?: boolean;
  id?: number | string;
  status?: string | number;
  expensetype_id?: number;
  description?: string;
  amount?: number;
}

export const useExpensesApc = ({ enabled = true, ...params }: Params) => {
  return useQuery({
    queryKey: ["expenses", params],
    queryFn: () =>
      baseApi
        .get("/v1/expense", { params })
        .then(({ data: response }) => (response as ExpensesTypes) || null),
    enabled,
    refetchOnMount: true,
  });
};
export default useExpensesApc;
