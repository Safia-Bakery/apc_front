import { useMutation } from "@tanstack/react-query";
import apiClient from "src/main";

interface Body {
  id: number;
  category_id: number;
}

const marketingReassignMutation = () => {
  return useMutation(["redirect_marketing_order"], (body: Body) =>
    apiClient
      .put({
        url: "/v1/request/redirect",
        body,
      })
      .then(({ data }) => data)
      .catch((e) => e.message)
  );
};
export default marketingReassignMutation;
