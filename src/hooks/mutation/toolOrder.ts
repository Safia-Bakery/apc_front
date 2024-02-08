import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

interface Body {
  id: number;
  status: number;
}

const toolOrderMutation = () => {
  return useMutation({
    mutationKey: ["update_tools_order"],
    mutationFn: async (body: Body) => {
      const { data } = await apiClient.put({ url: "/toolorder", body });
      return data;
    },
  });
};
export default toolOrderMutation;
