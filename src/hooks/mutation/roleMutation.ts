import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";

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
        return baseApi
          .put("/user/roles", { name, id })
          .then(({ data }) => data);
      else
        return baseApi
          .post("/user/roles", { name, status })
          .then(({ data }) => data);
    },
  });
};
export default roleMutation;
