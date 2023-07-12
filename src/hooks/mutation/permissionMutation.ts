import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";

const permissionMutation = () => {
  return useMutation(["post_role"], (body: { ids: number[]; id: number }) =>
    apiClient
      .post(`/user/group/permission?id=${body.id}`, body.ids)
      .then(({ data }) => data)
      .catch((e) => e.message)
  );
};
export default permissionMutation;
