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

export const useCars = ({ enabled = true, ...params }: Props) => {
  return useQuery({
    queryKey: ["logystics_cars", params],
    queryFn: () =>
      apiClient
        .get({
          url: "/v1/cars",
          params,
        })
        .then(({ data: response }) => response as CarsTypes[]),
    enabled,
    refetchOnMount: true,
  });
};
export default useCars;
