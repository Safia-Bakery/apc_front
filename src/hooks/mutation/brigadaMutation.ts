import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";
import { Departments } from "@/utils/types";

interface BodyType {
  id?: number;
  name: string;
  description: string;
  status?: number;
  users?: number[];
  sphere_status?: number;
  department?: Departments;
  is_outsource?: boolean;
}

const brigadaMutation = () => {
  return useMutation({
    mutationKey: ["update_brigada"],
    mutationFn: async (body: BodyType) => {
      const { id, users } = body;
      if (id || users) {
        const { data } = await apiClient.put({
          url: "/brigadas",
          body,
        });
        return data;
      } else {
        const { data } = await apiClient.post({
          url: "/brigadas",
          body,
        });
        return data;
      }
    },
    onError: (e) => errorToast(e.message),
  });
};
export default brigadaMutation;
