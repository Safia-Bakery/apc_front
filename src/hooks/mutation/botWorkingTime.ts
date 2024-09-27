import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import errorToast from "@/utils/errorToast";

const botWorkingTime = () => {
  return useMutation({
    mutationKey: ["bot_time"],
    mutationFn: (body: { from_time: string; to_time: string }) =>
      baseApi
        .put("/working", body)
        .then((data) => data)
        .catch((e: Error) => errorToast(e.message)),
  });
};
export default botWorkingTime;
