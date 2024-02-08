import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

interface Body {
  id: number;
  price?: number;
  amount_left?: number;
  total_price?: number;
  department?: number;
  min_amount?: number;
  max_amount?: number;
  ftime?: number | string;
  image?: string;
}

const updateToolsMutation = () => {
  return useMutation({
    mutationKey: ["update_tools"],
    mutationFn: async (body: Body) => {
      const { data } = await apiClient.put({ url: "/tools/", body });
      return data;
    },
  });
};
export default updateToolsMutation;
