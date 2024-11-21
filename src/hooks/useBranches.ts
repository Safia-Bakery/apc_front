import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { BranchTypes, EPresetTimes } from "@/utils/types";

interface BodyTypes {
  name?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  fillial_status?: number | string;
}

interface Params {
  enabled?: boolean;
  size?: number;
  page?: number;
  body?: BodyTypes;
  origin?: number;
  warehouse?: boolean;
}

export const useBranches = ({
  enabled = true,
  size,
  page = 1,
  body,
  origin = 0,
  warehouse,
}: Params) => {
  return useQuery({
    queryKey: ["branches", origin, body, page, warehouse],
    queryFn: () =>
      baseApi
        .get(warehouse ? "/get/fillial/fabrica" : "/fillials", {
          params: { page, size, origin, ...body },
          timeout: EPresetTimes.MINUTE,
        })
        .then(({ data: response }) => response as BranchTypes),
    enabled,
    staleTime: EPresetTimes.MINUTE * 4,
  });
};
export default useBranches;
