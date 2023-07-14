import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";

const categoryMutation = () => {
  return useMutation(
    ["handle_category"],
    (body: {
      name: string;
      status: number;
      description: string;
      id?: number;
    }) => {
      if (!body.id)
        return apiClient
          .post({ url: "/category", body })
          .then(({ data }) => data);
      else return apiClient.put("/category", body).then(({ data }) => data);
    }
  );
};
export default categoryMutation;
