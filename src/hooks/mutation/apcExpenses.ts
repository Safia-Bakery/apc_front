import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";

interface Body {
  amount: number;
  description: string;
  from_date: string;
  to_date: string;
  expensetype_id: number;
  status?: number;
  id?: number;
}

const apcExpensesMutation = () => {
  return useMutation({
    mutationKey: ["apc_expenses"],
    mutationFn: async (body: Body) => {
      if (body.id) {
        const { data } = await baseApi.put("/v1/expense", body);
        return data;
      } else {
        const { data } = await baseApi.post("/v1/expense", body);
        return data;
      }
    },
  });
};
export default apcExpensesMutation;
