import { useQuery } from "@tanstack/react-query";
import apiClient from "src/main";
import { DistinctTypes } from "src/utils/types";

export const useDistinct = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      apiClient.get("/v1/expanditure/distinct").then(({ data: response }) => {
        return response as DistinctTypes;
      }),
    enabled,
    refetchOnMount: true,
  });
};
export default useDistinct;
