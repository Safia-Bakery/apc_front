import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { FAQTypes } from "@/utils/types";

const faqsMutation = () => {
  return useMutation({
    mutationKey: ["faqs_mutation"],
    mutationFn: async (body: FAQTypes) => {
      if (body.id) {
        const { data } = await baseApi.put("/hr/question", body);
        return data;
      } else {
        const { data } = await baseApi.post("/hr/question", body);
        return data;
      }
    },
  });
};
export default faqsMutation;
