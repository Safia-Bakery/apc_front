import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";

const apcBotMutation = () => {
  return useMutation({
    mutationKey: ["apc_bot_settings"],
    mutationFn: async () => {
      const { data } = await baseApi.post("/restart-arcbot/");
      return data;
    },
  });
};
export default apcBotMutation;
