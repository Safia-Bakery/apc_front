import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/utils/types";
import { BasePaginateRes, FAQRequestTypes } from "@/utils/types";
import { HRRequestTypes } from "@/utils/helpers";

interface Body {
  id?: number;
  enabled?: boolean;
  size?: number;
  page?: number;
  sphere?: HRRequestTypes;
}

export const useFAQRequests = ({ enabled, ...params }: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["faq_questions", params],
    queryFn: () =>
      apiClient
        .get({ url: "/hr/request", params })
        .then(
          ({ data: response }) => response as BasePaginateRes<FAQRequestTypes>
        ),
    enabled: enabled && !!token,
  });
};
export default useFAQRequests;
