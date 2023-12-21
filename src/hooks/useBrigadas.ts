import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { BrigadaTypes, Departments } from "@/utils/types";

export const useBrigadas = ({
  enabled = true,
  size,
  page = 1,
  sphere_status,
  department,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
  sphere_status?: number;
  department?: Departments;
}) => {
  return useQuery({
    queryKey: ["brigadas", page, sphere_status, department],
    queryFn: () =>
      apiClient
        .get("/brigadas", { page, size, sphere_status, department })
        .then(({ data: response }) => response as BrigadaTypes),
    enabled,
  });
};
export default useBrigadas;
