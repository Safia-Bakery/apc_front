import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";

interface Body {
  name: string;
  status: number;
}

const apcExpenseTypesMutation = () => {
  return useMutation({
    mutationKey: ["apc_expense_types"],
    mutationFn: async (body: Body) => {
      const { data } = await baseApi.post("/v1/expense/type", body);
      return data;
    },
  });
};
export default apcExpenseTypesMutation;
