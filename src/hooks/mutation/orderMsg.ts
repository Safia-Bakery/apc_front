import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { EPresetTimes } from "@/utils/types";

interface Body {
  request_id: number;
  message: string;
  status?: number;
  photo?: any;
  send_to_client?: boolean;
}

const orderMsgMutation = () => {
  return useMutation({
    mutationKey: ["order_message"],
    mutationFn: (body: Body) =>
      baseApi
        .post("/api/v2/requests/it/message", body, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: EPresetTimes.MINUTE * 2,
        })
        .then(({ data }) => data),
  });
};
export default orderMsgMutation;
