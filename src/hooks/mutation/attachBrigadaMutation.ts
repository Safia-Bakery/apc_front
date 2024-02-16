import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
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
  pause_reason?: string;
}

const attachBrigadaMutation = () => {
  return useMutation({
    mutationKey: ["attach_brigada_to_request"],
    mutationFn: async (body: Body) => {
      const { data } = await apiClient.put({
        url: "/request/attach/brigada",
        body,
      });
      return data;
    },
    retry: 3,
    retryDelay: 1000,
  });
};
export default attachBrigadaMutation;
