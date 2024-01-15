import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/utils/types";
import { FAQRequestTypes } from "@/utils/types";

interface Body {
  id?: number;
  enabled?: boolean;
  size?: number;
  page?: number;
}

export const useFAQRequests = (body: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["faq_questions", body],
    queryFn: () =>
      apiClient
        .get("/hr/request", body)
        .then(({ data: response }) => response as FAQRequestTypes),
    enabled: body.enabled && !!token,
  });
};
export default useFAQRequests;

///hr/request
