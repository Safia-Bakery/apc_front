import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

interface Body {
  id: number;
  status: number;
}

const toolOrderMutation = () => {
  return useMutation(["update_tools_order"], async (body: Body) => {
    const { data } = await apiClient.put({ url: "/toolorder", body });
    return data;
  });
};
export default toolOrderMutation;
