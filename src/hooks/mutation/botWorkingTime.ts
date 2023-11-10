import { useMutation } from "@tanstack/react-query";
import apiClient from "src/main";
import { errorToast } from "src/utils/toast";

const botWorkingTime = () => {
  return useMutation(
    ["bot_time"],
    (body: { from_time: string; to_time: string }) =>
      apiClient
        .put({ url: "/working", body })
        .then((data) => data)
        .catch((e: Error) => errorToast(e.message))
  );
};
export default botWorkingTime;
