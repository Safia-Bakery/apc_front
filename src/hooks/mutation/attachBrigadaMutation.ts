import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { RequestStatus } from "src/utils/types";

const attachBrigadaMutation = () => {
  return useMutation(
    ["attach_brigada_to_request"],
    (body: {
      request_id: number;
      brigada_id: number;
      status: RequestStatus;
      comment?: string;
    }) =>
      apiClient
        .put({ url: "/request/attach/brigada", body })
        .then(({ data }) => data)
  );
};
export default attachBrigadaMutation;
