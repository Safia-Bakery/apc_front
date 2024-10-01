import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";

interface Body {
  id: number;
  status: number;
}

const toolOrderMutation = () => {
  return useMutation({
    mutationKey: ["update_tools_order"],
    mutationFn: async (body: Body) => {
      const { data } = await baseApi.put("/toolorder", body);
      return data;
    },
  });
};
export default toolOrderMutation;
