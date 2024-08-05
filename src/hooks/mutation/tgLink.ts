import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { TgLinkTypes } from "@/utils/types";

const tgLinkMutation = () => {
  return useMutation({
    mutationKey: ["tg_link_mutation"],
    mutationFn: async (body: TgLinkTypes) => {
      if (body.id) {
        const { data } = await apiClient.put({ url: "/v1/telegrams", body });
        return data;
      } else {
        const { data } = await apiClient.post({ url: "/v1/telegrams", body });
        return data;
      }
    },
  });
};
export default tgLinkMutation;
