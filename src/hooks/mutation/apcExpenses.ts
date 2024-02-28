import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

interface Body {
  amount: number;
  description: string;
  from_date: string;
  to_date: string;
  expensetype_id: number;
  status: number;
  id?: number;
}

const apcExpensesMutation = () => {
  return useMutation({
    mutationKey: ["apc_expenses"],
    mutationFn: async (body: Body) => {
      if (body.id) {
        const { data } = await apiClient.put({ url: "/v1/expense", body });
        return data;
      } else {
        const { data } = await apiClient.post({ url: "/v1/expense", body });
        return data;
      }
    },
  });
};
export default apcExpensesMutation;
