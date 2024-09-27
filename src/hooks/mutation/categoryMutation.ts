import { useMutation } from "@tanstack/react-query";
import { Departments, EPresetTimes, Sphere } from "@/utils/types";
import baseApi from "@/api/base_api";

interface Body {
  name: string;
  status: number;
  description: string;
  id?: number;
  urgent: number;
  department?: Departments;
  sphere_status?: Sphere;
  files?: any;
  ftime?: number;
  parent_id?: number;
  is_child?: boolean;
  telegram_id?: number;
  price?: number;
}

const categoryMutation = () => {
  return useMutation({
    mutationKey: ["handle_category"],
    mutationFn: async (body: Body) => {
      if (!body.id) {
        const { data } = await baseApi.post("/category", body, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: EPresetTimes.MINUTE * 2,
        });
        return data;
      } else {
        const { data } = await baseApi.put("/category", body, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: EPresetTimes.MINUTE * 2,
        });
        return data;
      }
    },
  });
};
export default categoryMutation;
