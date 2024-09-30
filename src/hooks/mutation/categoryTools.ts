import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";

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
        const { data } = await baseApi.delete("/v1/category/tools", {
          data: body,
        });
        return data;
      } else {
        const { data } = await baseApi.post("/v1/category/tools", body);
        return data;
      }
    },
  });
};
export default categoryTools;
