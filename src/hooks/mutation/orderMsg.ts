import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

interface Body {
  request_id: number;
  message: string;
  status?: number;
}

const orderMsgMutation = () => {
  return useMutation({
    mutationKey: ["order_message"],
    mutationFn: (body: Body) =>
      apiClient
        .post({ url: "/v1/reqest/message", body })
        .then(({ data }) => data),
  });
};
export default orderMsgMutation;
