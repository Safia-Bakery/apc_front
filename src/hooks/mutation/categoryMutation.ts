import { useMutation } from "@tanstack/react-query";
import apiClient from "src/main";
import { Departments } from "src/utils/types";

interface Body {
  name: string;
  status: number;
  description: string;
  id?: number;
  urgent: number;
  department?: Departments;
}

const categoryMutation = () => {
  return useMutation(["handle_category"], (body: Body) => {
    if (!body.id)
      return apiClient
        .post({ url: "/category", body })
        .then(({ data }) => data);
    else
      return apiClient.put({ url: "/category", body }).then(({ data }) => data);
  });
};
export default categoryMutation;
