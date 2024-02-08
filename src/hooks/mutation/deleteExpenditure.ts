import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";

const deleteExpenditureMutation = () => {
  return useMutation({
    mutationKey: ["delete_expenditure"],
    mutationFn: (id: number) => {
      return apiClient
        .delete({ url: "/v1/expanditure", params: { id } })
        .then(({ data }) => data)
        .catch((e) => errorToast(e.message));
    },
  });
};
export default deleteExpenditureMutation;
