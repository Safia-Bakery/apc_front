import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

interface Body {
  name: string;
  status: number;
}

const apcExpenseTypesMutation = () => {
  return useMutation({
    mutationKey: ["apc_expense_types"],
    mutationFn: async (body: Body) => {
      const { data } = await apiClient.post({ url: "/v1/expense/type", body });
      return data;
    },
  });
};
export default apcExpenseTypesMutation;
