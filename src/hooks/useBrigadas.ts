import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { BrigadaTypes, Departments, EPresetTimes } from "@/utils/types";

type Params = {
  enabled?: boolean;
  size?: number;
  page?: number;
  sphere_status?: number;
  department?: Departments;
};

const useBrigadas = ({ page, sphere_status, department, enabled }: Params) => {
  return useQuery({
    queryKey: ["brigadas", page, sphere_status, department],
    queryFn: () =>
      baseApi
        .get("/brigadas", { params: { page, sphere_status, department } })
        .then(({ data: response }) => response as BrigadaTypes),
    enabled,
    staleTime: EPresetTimes.MINUTE * 5,
  });
};
export default useBrigadas;
