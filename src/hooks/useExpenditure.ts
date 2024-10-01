import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
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
      baseApi
        .get("/v1/expanditure", { params: { id } })
        .then(({ data: response }) => (response as ExpendituresTypes) || null),
    enabled: !!id && enabled,
    refetchOnMount: true,
  });
};
export default useExpenditure;
