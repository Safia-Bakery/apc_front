import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";

interface Body {
  id: number;
}

const deleteProductMutation = () => {
  return useMutation({
    mutationKey: ["delete_inventory_prod"],
    mutationFn: async (params: Body) => {
      const { data } = await apiClient.delete({ url: "/tools", params });
      return data;
    },
    onError: (e) => errorToast(e.message),
    retry: 3,
    retryDelay: 2000,
  });
};
export default deleteProductMutation;
