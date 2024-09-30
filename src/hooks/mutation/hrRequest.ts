import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";

interface BodyTypes {
  id: number;
  status: number;
  answer?: string;
}

const hrRequestsMutation = () => {
  return useMutation({
    mutationKey: ["faqs_requests_mutation"],
    mutationFn: async (body: BodyTypes) => {
      const { data } = await baseApi.put("/hr/request", body);
      return data;
    },
  });
};
export default hrRequestsMutation;
