import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import errorToast from "@/utils/errorToast";

const deleteExpenditureMutation = () => {
  return useMutation({
    mutationKey: ["delete_expenditure"],
    mutationFn: (id: number) => {
      return baseApi
        .delete("/v1/expanditure", { params: id })
        .then(({ data }) => data)
        .catch((e) => errorToast(e.message));
    },
  });
};
export default deleteExpenditureMutation;
