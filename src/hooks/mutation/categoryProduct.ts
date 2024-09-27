import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { EPresetTimes } from "@/utils/types";

interface Body {
  name: string;
  status: number;
  description: string;
  id?: number;
  category_id?: number | string;
  image?: any;
}

const categoryProductMutation = () => {
  const contentType = "multipart/form-data";
  const config = { timeout: EPresetTimes.MINUTE * 5 };
  return useMutation({
    mutationKey: ["handle_category_product"],
    mutationFn: async (body: Body) => {
      if (!body.id) {
        const { data } = await apiClient.post({
          url: "/v1/cat/product",
          body,
          config,
          contentType,
        });
        return data;
      } else {
        const { data } = await apiClient.put({
          url: "/v1/cat/product",
          body,
          config,
          contentType,
        });
        return data;
      }
    },
  });
};
export default categoryProductMutation;
