import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { brigadaHandler } from "src/redux/reducers/cacheResources";
import { useAppDispatch } from "src/redux/utils/types";
import { BrigadaType, BrigadaTypes } from "src/utils/types";

export const useBrigadas = ({
  enabled = true,
  size = 20,
  page = 1,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
}) => {
  const dispatch = useAppDispatch();
  return useQuery({
    queryKey: ["brigadas"],
    queryFn: () =>
      apiClient
        .get(`/brigadas?size=${size}&page=${page}`)
        .then(({ data: response }: { data: any }) => {
          dispatch(brigadaHandler(response.items as BrigadaTypes["items"]));
          return response as BrigadaTypes;
        }),
    enabled,
  });
};
export default useBrigadas;
