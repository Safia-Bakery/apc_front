import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";

const permissionMutation = () => {
  return useMutation({
    mutationKey: ["post_role"],
    mutationFn: (body: { ids: number[]; id: number | string }) =>
      baseApi
        .post(`/user/group/permission`, body.ids, { params: { id: body.id } })
        .then(({ data }) => data)
        .catch((e) => e.message),
  });
};
export default permissionMutation;
