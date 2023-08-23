import { useMutation } from "@tanstack/react-query";
import apiClient from "src/main";

const roleMutation = () => {
  return useMutation(
    ["post_role"],
    ({
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
    }
  );
};
export default roleMutation;
