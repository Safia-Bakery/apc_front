import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";

const syncExpenditure = () => {
  return useMutation(["expenditure_sync"], (body: { request_id: number }) =>
    apiClient
      .put({ url: "/v1/expanditure/iiko", body, config: { timeout: 10000 } })
      .then((data) => data)
      .catch((e: Error) => errorToast(e.message))
  );
};
export default syncExpenditure;
