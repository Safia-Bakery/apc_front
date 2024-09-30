import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";

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
        const { data } = await baseApi.put("/v1/cars", body);
        return data;
      } else {
        const { data } = await baseApi.post("/v1/cars", body);
        return data;
      }
    },
  });
};
export default carsMutation;
