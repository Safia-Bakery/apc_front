import { useQuery } from "@tanstack/react-query";
import apiClient from "src/main";
import { BranchTypes } from "src/utils/types";

interface BodyTypes {
  name?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  fillial_status?: number | string;
}

export const useWarehouse = ({
  enabled = true,
  size,
  page = 1,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["warehouse"],
    queryFn: () =>
      apiClient
        .get("/get/fillial/fabrica", { page, size })
        .then(({ data: response }) => {
          return response as BranchTypes;
        }),
    enabled,
  });
};
export default useWarehouse;
