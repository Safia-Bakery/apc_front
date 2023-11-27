import { useQuery } from "@tanstack/react-query";
import apiClient from "src/main";
import { permissionSelector } from "src/store/reducers/sidebar";
import { useAppSelector } from "src/store/utils/types";
import { BranchTypes, MainPermissions } from "src/utils/types";

interface BodyTypes {
  name?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  fillial_status?: number | string;
}

export const useBranches = ({
  enabled = true,
  size,
  page = 1,
  body,
  origin = 0,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
  body?: BodyTypes;
  origin?: number;
}) => {
  const permmission = useAppSelector(permissionSelector);
  return useQuery({
    queryKey: ["branches", origin, body, page],
    queryFn: () =>
      apiClient
        .get("/fillials", { page, size, origin, ...body })
        .then(({ data: response }) => response as BranchTypes),
    enabled: enabled && permmission?.[MainPermissions.get_fillials_list],
  });
};
export default useBranches;
