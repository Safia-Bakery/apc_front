import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";

interface Body {
  comment?: string;
  status: number;
  amount?: number;
  id: number;
}

const updateInventoryProdMutation = () => {
  return useMutation({
    mutationKey: ["update_expenditure"],
    mutationFn: async (body: Body) => {
      const { data } = await baseApi.put("/v1/expenditure", body);
      return data;
    },
  });
};
export default updateInventoryProdMutation;
