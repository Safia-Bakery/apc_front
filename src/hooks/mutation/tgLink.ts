import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { TgLinkTypes } from "@/utils/types";

const tgLinkMutation = () => {
  return useMutation({
    mutationKey: ["tg_link_mutation"],
    mutationFn: async (body: TgLinkTypes) => {
      if (body.id) {
        const { data } = await baseApi.put("/v1/telegrams", body);
        return data;
      } else {
        const { data } = await baseApi.post("/v1/telegrams", body);
        return data;
      }
    },
  });
};
export default tgLinkMutation;
