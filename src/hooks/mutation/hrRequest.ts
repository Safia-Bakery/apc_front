import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

interface BodyTypes {
  id: number;
  status: number;
  answer?: string;
}

const hrRequestsMutation = () => {
  return useMutation({
    mutationKey: ["faqs_requests_mutation"],
    mutationFn: async (body: BodyTypes) => {
      const { data } = await apiClient.put({ url: "/hr/request", body });
      return data;
    },
  });
};
export default hrRequestsMutation;
