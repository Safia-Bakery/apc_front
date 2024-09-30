import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { BrigadaType } from "@/utils/types";

export const useBrigada = ({
  id,
  enabled = true,
}: {
  enabled?: boolean;
  id: number | string;
}) => {
  return useQuery({
    queryKey: ["brigada", id],
    queryFn: () =>
      baseApi
        .get(`/brigadas/${id}`)
        .then(({ data: response }) => (response as BrigadaType) || null),
    enabled: !!id && enabled,
    refetchOnMount: true,
  });
};
export default useBrigada;
