import { useQuery } from "@tanstack/react-query";
import apiClient from "@/main";
import { CarsTypes } from "@/utils/types";

interface Props {
  enabled?: boolean;
  size?: number;
  page?: number;
  name?: string;
  status?: string | number;
  id?: number;
}

export const useCars = ({
  enabled = true,
  size,
  page = 1,
  name,
  status,
  id,
}: Props) => {
  return useQuery({
    queryKey: ["logystics_cars", name, status, id, page],
    queryFn: () =>
      apiClient
        .get("/v1/cars", {
          size,
          page,
          name,
          status,
          id,
        })
        .then(({ data: response }) => response as CarsTypes[]),
    enabled,
    refetchOnMount: true,
  });
};
export default useCars;
