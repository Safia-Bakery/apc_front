import baseApi from "@/api/base_api";
import errorToast from "@/utils/errorToast";
import { useMutation } from "@tanstack/react-query";

interface Body<T> {
  start_date: string;
  finish_date: string;
  category_id?: number;
  status?: number;
  callbackUrl: string;
  callbackMethod?: "post" | "get";
}

function baseExcelMutation<T>() {
  return useMutation({
    mutationKey: ["base_excell_mutation"],
    mutationFn: async ({
      callbackUrl,
      callbackMethod = "post",
      ...body
    }: Body<T>) => {
      const { data } = await baseApi[callbackMethod](callbackUrl, body);
      return data as T;
    },
    onError: (e) => errorToast(e.message),
  });
}
export default baseExcelMutation;
