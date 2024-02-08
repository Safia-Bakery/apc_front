import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

interface Body {
  name: string;
  status: number;
  number: string;
  id?: number;
}

const carsMutation = () => {
  return useMutation({
    mutationKey: ["cars_mutation"],
    mutationFn: async (body: Body) => {
      if (body.id) {
        const { data } = await apiClient.put({ url: "/v1/cars", body });
        return data;
      } else {
        const { data } = await apiClient.post({ url: "/v1/cars", body });
        return data;
      }
    },
  });
};
export default carsMutation;
