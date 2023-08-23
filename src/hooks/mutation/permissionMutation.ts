import { useMutation } from "@tanstack/react-query";
import apiClient from "src/main";

const permissionMutation = () => {
  return useMutation(
    ["post_role"],
    (body: { ids: number[]; id: number | string }) =>
      apiClient
        .post({
          url: `/user/group/permission`,
          body: body.ids,
          params: { id: body.id },
        })
        .then(({ data }) => data)
        .catch((e) => e.message)
  );
};
export default permissionMutation;
