import { useMutation } from "@tanstack/react-query";
import { Departments, EPresetTimes, Sphere } from "@/utils/types";
import apiClient from "@/main";

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
}

const categoryMutation = () => {
  const contentType = "multipart/form-data";
  const config = { timeout: EPresetTimes.MINUTE };
  return useMutation({
    mutationKey: ["handle_category"],
    mutationFn: async (body: Body) => {
      if (!body.id) {
        const { data } = await apiClient.post({
          url: "/category",
          body,
          config,
          contentType,
        });
        return data;
      } else {
        const { data } = await apiClient.put({
          url: "/category",
          body,
          config,
          contentType,
        });
        return data;
      }
    },
  });
};
export default categoryMutation;
