import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";
import { RequestStatus } from "@/utils/types";

interface Body {
  request_id: number;
  status: RequestStatus;
  brigada_id?: number;
  deny_reason?: string;
  finishing_time?: string;
}

const attachBrigadaMutation = () => {
  return useMutation(["attach_brigada_to_request"], (body: Body) =>
    apiClient
      .put({ url: "/request/attach/brigada", body })
      .then((res) => res)
      .catch((e: Error) => errorToast(e.message))
  );
};
export default attachBrigadaMutation;
