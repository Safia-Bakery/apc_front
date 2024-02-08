import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

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
      const { data } = await apiClient.put({ url: "/v1/expenditure", body });
      return data;
    },
  });
};
export default updateInventoryProdMutation;
