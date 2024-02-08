import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";

const botWorkingTime = () => {
  return useMutation({
    mutationKey: ["bot_time"],
    mutationFn: (body: { from_time: string; to_time: string }) =>
      apiClient
        .put({ url: "/working", body })
        .then((data) => data)
        .catch((e: Error) => errorToast(e.message)),
  });
};
export default botWorkingTime;
