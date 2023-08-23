import { useMutation } from "@tanstack/react-query";
import apiClient from "src/main";
import { errorToast } from "src/utils/toast";
import { RequestStatus } from "src/utils/types";

const attachBrigadaMutation = () => {
  return useMutation(
    ["attach_brigada_to_request"],
    (body: {
      request_id: number;
      status: RequestStatus;
      brigada_id?: number;
      comment?: string;
    }) =>
      apiClient
        .put({ url: "/request/attach/brigada", body })
        .then((res) => res)
        .catch((e: Error) => errorToast(e.message))
  );
};
export default attachBrigadaMutation;
