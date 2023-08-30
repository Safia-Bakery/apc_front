import { useQuery } from "@tanstack/react-query";
import apiClient from "src/main";

import { useAppDispatch } from "src/redux/utils/types";
import { BrigadaTypes } from "src/utils/types";

export const useBrigadas = ({
  enabled = true,
  size,
  page = 1,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
}) => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["brigadas", page],
    queryFn: () =>
      apiClient
        .get("/brigadas", { page, size })
        .then(({ data: response }: { data: any }) => {
          return response as BrigadaTypes;
        }),
    enabled,
  });
};
export default useBrigadas;
