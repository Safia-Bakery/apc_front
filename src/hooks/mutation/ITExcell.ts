import { useMutation } from "@tanstack/react-query";
import apiClient from "@/main";
import { errorToast } from "@/utils/toast";

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
      const { data } = await apiClient.post({ url: "/it/excell", body });
      return data as { file_name: string };
    },
    onError: (e) => errorToast(e.message),
  });
};
export default ITExcellMutation;
