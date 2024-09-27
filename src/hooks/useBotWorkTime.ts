import { useQuery } from "@tanstack/react-query";
import { BotWorkTimeType } from "@/utils/types";
import baseApi from "@/api/base_api";

export const useBotWorkTime = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["bot_work_time"],
    queryFn: () =>
      baseApi
        .get("/working")
        .then(({ data: response }) => response as BotWorkTimeType),
    enabled,
  });
};
export default useBotWorkTime;
