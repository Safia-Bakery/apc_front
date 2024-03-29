import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

const roleMutation = () => {
  return useMutation({
    mutationKey: ["post_role"],
    mutationFn: ({
      name,
      status = 1,
      id,
    }: {
      name: string;
      status?: number;
      id?: number;
    }) => {
      if (id)
        return apiClient
          .put({ url: "/user/roles", body: { name, id } })
          .then(({ data }) => data);
      else
        return apiClient
          .post({ url: "/user/roles", body: { name, status } })
          .then(({ data }) => data);
    },
  });
};
export default roleMutation;
