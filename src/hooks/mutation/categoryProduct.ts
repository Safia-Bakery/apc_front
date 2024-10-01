import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
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
  return useMutation({
    mutationKey: ["handle_category_product"],
    mutationFn: async (body: Body) => {
      if (!body.id) {
        const { data } = await baseApi.post("/v1/cat/product", body, {
          headers: { "Content-Type": contentType },
          timeout: EPresetTimes.MINUTE * 5,
        });
        return data;
      } else {
        const { data } = await baseApi.put("/v1/cat/product", body, {
          headers: { "Content-Type": contentType },
          timeout: EPresetTimes.MINUTE * 5,
        });
        return data;
      }
    },
  });
};
export default categoryProductMutation;
