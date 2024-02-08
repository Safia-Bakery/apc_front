import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

interface Body {
  id: number;
  category_id: number;
}

const marketingReassignMutation = () => {
  return useMutation({
    mutationKey: ["redirect_marketing_order"],
    mutationFn: (body: Body) =>
      apiClient
        .put({
          url: "/v1/request/redirect",
          body,
        })
        .then(({ data }) => data)
        .catch((e) => e.message),
  });
};
export default marketingReassignMutation;
