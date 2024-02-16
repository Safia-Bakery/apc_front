import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

interface Body {
  request_id: number;
  message: string;
  status?: number;
  photo?: any;
}

const orderMsgMutation = () => {
  const contentType = "multipart/form-data";
  const config = { timeout: 100000 };
  return useMutation({
    mutationKey: ["order_message"],
    mutationFn: (body: Body) =>
      apiClient
        .post({ url: "/v1/reqest/message", body, config, contentType })
        .then(({ data }) => data),
  });
};
export default orderMsgMutation;
