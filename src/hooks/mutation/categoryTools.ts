import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

interface Body {
  category_id: number;
  tool_id: number;
  is_delete?: boolean;
}

const categoryTools = () => {
  return useMutation({
    mutationKey: ["category_tools"],
    mutationFn: async ({ is_delete, ...body }: Body) => {
      if (is_delete) {
        const { data } = await apiClient.delete({
          url: "/v1/category/tools",
          body,
        });
        return data;
      } else {
        const { data } = await apiClient.post({
          url: "/v1/category/tools",
          body,
        });
        return data;
      }
    },
  });
};
export default categoryTools;
