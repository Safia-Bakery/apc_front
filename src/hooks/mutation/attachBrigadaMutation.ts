import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";

const attachBrigadaMutation = () => {
  return useMutation(
    ["attach_brigada_to_request"],
    (body: { request_id: number; brigada_id: number }) =>
      apiClient.put("/request/attach/brigada", body).then(({ data }) => data)
  );
};
export default attachBrigadaMutation;
