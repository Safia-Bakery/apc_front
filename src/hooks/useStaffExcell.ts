import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";

interface Params {
  enabled?: boolean;
  page?: number;
  date?: string;
  file?: boolean;
}

type Res = {
  success: boolean;
  url: string;
  total_food: number;
  total_bread: number;
};

export const useStaffExcell = ({ enabled, ...params }: Params) => {
  return useQuery({
    queryKey: ["staff_excell_totals", params],
    queryFn: ({ signal }) =>
      baseApi
        .get("/v1/excell", { params, signal })
        .then(({ data: response }) => response as Res),
    enabled,
    refetchOnMount: true,
  });
};
export default useStaffExcell;
