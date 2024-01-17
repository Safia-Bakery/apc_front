import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/utils/types";
import { FAQRequestTypes } from "@/utils/types";
import { HRRequestTypes } from "@/utils/helpers";

interface Body {
  id?: number;
  enabled?: boolean;
  size?: number;
  page?: number;
  sphere?: HRRequestTypes;
}

export const useFAQRequests = (params: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["faq_questions", params],
    queryFn: () =>
      apiClient
        .get("/hr/request", params)
        .then(({ data: response }) => response as FAQRequestTypes),
    enabled: params.enabled && !!token,
  });
};
export default useFAQRequests;
