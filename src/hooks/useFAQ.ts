import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { tokenSelector } from "reducers/auth";
import { useAppSelector } from "@/store/utils/types";
import { BasePaginateRes, FAQTypes } from "@/utils/types";

interface Body {
  id?: number;
  enabled?: boolean;
  size?: number;
  page?: number;
}

export const useFAQ = ({ enabled, ...params }: Body) => {
  const token = useAppSelector(tokenSelector);
  return useQuery({
    queryKey: ["faq_questions", params],
    queryFn: () =>
      baseApi
        .get("/hr/question", { params })
        .then(({ data: response }) => response as BasePaginateRes<FAQTypes>),
    enabled: enabled && !!token,
  });
};
export default useFAQ;
