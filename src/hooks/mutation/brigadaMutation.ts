import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import errorToast from "@/utils/errorToast";
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
        const { data } = await baseApi.put("/brigadas", body);
        return data;
      } else {
        const { data } = await baseApi.post("/brigadas", body);
        return data;
      }
    },
    onError: (e) => errorToast(e.message),
  });
};
export default brigadaMutation;
