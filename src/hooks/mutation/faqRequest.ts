import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

interface BodyTypes {
  id: number;
  status: number;
}

const faqRequestsMutation = () => {
  return useMutation(["faqs_requests_mutation"], async (body: BodyTypes) => {
    const { data } = await apiClient.put({ url: "/hr/request", body });
    return data;
  });
};
export default faqRequestsMutation;
