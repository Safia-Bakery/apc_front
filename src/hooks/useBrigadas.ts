import { useQuery } from "@tanstack/react-query";
import { apiClient } from "src/main";
import { brigadaHandler } from "src/redux/reducers/cacheResources";
import { useAppDispatch } from "src/redux/utils/types";
import { BrigadaTypes } from "src/utils/types";

export const useBrigadas = ({
  enabled = true,
  size,
  page,
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
        .get("/brigadas", { page, size })
        .then(({ data: response }: { data: any }) => {
          dispatch(brigadaHandler(response.items as BrigadaTypes["items"]));
          return response as BrigadaTypes;
        }),
    enabled,
  });
};
export default useBrigadas;
