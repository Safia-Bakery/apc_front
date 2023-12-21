import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { ExpendituresTypes } from "@/utils/types";

export const useExpenditure = ({
  id,
  enabled = true,
}: {
  enabled?: boolean;
  id: number | string;
}) => {
  return useQuery({
    queryKey: ["get_expanditure", id],
    queryFn: () =>
      apiClient
        .get("/v1/expanditure", { id })
        .then(({ data: response }) => (response as ExpendituresTypes) || null),
    enabled: !!id && enabled,
    refetchOnMount: true,
  });
};
export default useExpenditure;
