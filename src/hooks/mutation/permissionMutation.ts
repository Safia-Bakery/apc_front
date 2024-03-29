import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

const permissionMutation = () => {
  return useMutation({
    mutationKey: ["post_role"],
    mutationFn: (body: { ids: number[]; id: number | string }) =>
      apiClient
        .post({
          url: `/user/group/permission`,
          body: body.ids,
          params: { id: body.id },
        })
        .then(({ data }) => data)
        .catch((e) => e.message),
  });
};
export default permissionMutation;
