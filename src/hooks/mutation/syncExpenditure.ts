import { useMutation } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { errorToast } from "src/utils/toast";

interface RegisterTypes {
  id: number | string;
  username: string;
  full_name: string;
  success: boolean;
}

const syncExpenditure = () => {
  return useMutation(["expenditure_sync"], (body: { request_id: number }) =>
    apiClient
      .put({ url: "/v1/expanditure/iiko", body })
      .then((data) => data)
      .catch((e: Error) => errorToast(e.message))
  );
};
export default syncExpenditure;
