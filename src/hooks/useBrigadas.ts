import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { BrigadaTypes } from "src/utils/types";

export const useBrigadas = ({
  enabled = true,
  size = 20,
  page = 1,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["brigadas"],
    queryFn: () =>
      apiClient
        .get(`/brigadas?size=${size}&page=${page}`)
        .then(({ data: response }) => (response as BrigadaTypes) || null),
    enabled,
  });
};
export default useBrigadas;
