import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";

const deleteExpenditureMutation = () => {
  return useMutation(["delete_expenditure"], (id: number) => {
    return apiClient
      .delete({ url: "/v1/expanditure", params: { id } })
      .then(({ data }) => data)
      .catch((e: Error) => errorToast(e.message));
  });
};
export default deleteExpenditureMutation;
