import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";

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
      apiClient
        .get({ url: "/v1/excell", params, config: { signal } })
        .then(({ data: response }) => response as Res),
    enabled,
    refetchOnMount: true,
  });
};
export default useStaffExcell;
