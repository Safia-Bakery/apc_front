import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
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
      apiClient
        .get({ url: `/brigadas/${id}` })
        .then(({ data: response }) => (response as BrigadaType) || null),
    enabled: !!id && enabled,
    refetchOnMount: true,
  });
};
export default useBrigada;
