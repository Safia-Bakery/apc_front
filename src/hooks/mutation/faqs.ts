import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { FAQTypes } from "@/utils/types";

const faqsMutation = () => {
  return useMutation(["faqs_mutation"], async (body: FAQTypes) => {
    if (body.id) {
      const { data } = await apiClient.put({ url: "/hr/question", body });
      return data;
    } else {
      const { data } = await apiClient.post({ url: "/hr/question", body });
      return data;
    }
  });
};
export default faqsMutation;
