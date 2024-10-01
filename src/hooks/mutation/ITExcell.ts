import { useMutation } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import errorToast from "@/utils/errorToast";

interface Body {
  start_date: string;
  finish_date: string;
  category_id?: number;
  status?: number;
}

const ITExcellMutation = () => {
  return useMutation({
    mutationKey: ["it_excell_mutation"],
    mutationFn: async (body: Body) => {
      const { data } = await baseApi.post("/it/excell", body);
      return data as { file_name: string };
    },
    onError: (e) => errorToast(e.message),
  });
};
export default ITExcellMutation;
