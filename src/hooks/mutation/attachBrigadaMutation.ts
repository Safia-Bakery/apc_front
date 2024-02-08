import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";
import { RequestStatus } from "@/utils/types";

interface Body {
  request_id: number;
  status?: RequestStatus;
  brigada_id?: number;
  deny_reason?: string;
  finishing_time?: string;
  car_id?: number;
  fillial_id?: string;
  category_id?: string | number;
}

const attachBrigadaMutation = () => {
  return useMutation({
    mutationKey: ["attach_brigada_to_request"],
    mutationFn: (body: Body) =>
      apiClient
        .put({ url: "/request/attach/brigada", body })
        .then((res) => res)
        .catch((e: Error) => errorToast(e.message)),

    // retry: true, // todo
    // retryDelay: 1000,
  });
};
export default attachBrigadaMutation;
