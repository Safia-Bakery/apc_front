import { useQuery } from "@tanstack/react-query";
import apiClient from "src/main";
import { BrigadaTypes } from "src/utils/types";

export const useBrigadas = ({
  enabled = true,
  size,
  page = 1,
  sphere_status,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
  sphere_status?: number;
}) => {
  return useQuery({
    queryKey: ["brigadas", page, sphere_status],
    queryFn: () =>
      apiClient
        .get("/brigadas", { page, size, sphere_status })
        .then(({ data: response }: { data: any }) => {
          return response as BrigadaTypes;
        }),
    enabled,
  });
};
export default useBrigadas;
