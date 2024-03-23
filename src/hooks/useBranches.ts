import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
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

const config = { timeout: EPresetTimes.SECOND * 15 };

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
      apiClient
        .get({
          url: warehouse ? "/get/fillial/fabrica" : "/fillials",
          params: { page, size, origin, ...body },
          config,
        })
        .then(({ data: response }) => response as BranchTypes),
    enabled,
  });
};
export default useBranches;
