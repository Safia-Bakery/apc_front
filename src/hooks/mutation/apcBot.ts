import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";

const apcBotMutation = () => {
  return useMutation({
    mutationKey: ["apc_bot_settings"],
    mutationFn: async () => {
      const { data } = await apiClient.post({ url: "/restart-arcbot/" });
      return data;
    },
  });
};
export default apcBotMutation;
