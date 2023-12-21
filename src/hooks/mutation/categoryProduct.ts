import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

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
  const config = { timeout: 100000 };
  return useMutation(["handle_category_product"], async (body: Body) => {
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
  });
};
export default categoryProductMutation;
