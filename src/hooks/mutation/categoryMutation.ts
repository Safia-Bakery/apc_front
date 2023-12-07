import { useMutation } from "@tanstack/react-query";
import { Departments, Sphere } from "src/utils/types";
import apiClient from "src/main";

interface Body {
  name: string;
  status: number;
  description: string;
  id?: number;
  urgent: number;
  department?: Departments;
  sphere_status?: Sphere;
  files?: any;
}

const categoryMutation = () => {
  const contentType = "multipart/form-data";
  const config = { timeout: 100000 };
  return useMutation(["handle_category"], async (body: Body) => {
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
  });
};
export default categoryMutation;
