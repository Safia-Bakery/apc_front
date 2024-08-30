import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";

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
      const { data } = await apiClient.post({
        url: "/v1/excell/uniforms",
        body,
      });
      return data as string;
    },
    onError: (e) => errorToast(e.message),
  });
};
export default formExcelMutation;
