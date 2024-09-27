import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import errorToast from "@/utils/errorToast";

interface Body {
  start_date: string;
  finish_date: string;
  category_id?: number;
  status?: number[];
}

const formExcelMutation = () => {
  return useMutation({
    mutationKey: ["form_excell_mutation"],
    mutationFn: async (body: Body) => {
      const { data } = await baseApi.post("/v1/excell/uniforms", body);
      return data as string;
    },
    onError: (e) => errorToast(e.message),
  });
};
export default formExcelMutation;
