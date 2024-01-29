import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { CommentTypes } from "@/utils/types";

interface Params {
  enabled?: boolean;
  page?: number;
  date?: string;
  file?: boolean;
}

export const useStaffExcell = ({
  enabled = true,
  page = 1,
  date,
  file,
}: Params) => {
  return useQuery({
    queryKey: ["staff_excell_totals", page, date, file],
    queryFn: () =>
      apiClient.get("/v1/excell", { page, date, file }).then(
        ({ data: response }) =>
          response as {
            success: boolean;
            url: string;
            total_food: number;
            total_bread: number;
          }
      ),
    enabled,
    refetchOnMount: true,
  });
};
export default useStaffExcell;
