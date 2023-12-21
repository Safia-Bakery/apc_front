import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { BotWorkTimeType } from "@/utils/types";

export const useBotWorkTime = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["bot_work_time"],
    queryFn: () =>
      apiClient
        .get(`/working`)
        .then(({ data: response }) => response as BotWorkTimeType),
    enabled,
  });
};
export default useBotWorkTime;
