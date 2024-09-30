import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { BasePaginateRes, TgLinkTypes } from "@/utils/types";

interface Params {
  enabled?: boolean;
  id?: number;
  size?: number;
  page?: number;
}

export const useTgLinks = ({ enabled = true, ...params }: Params) => {
  return useQuery({
    queryKey: ["tg_links", params],
    queryFn: () =>
      baseApi
        .get("/v1/telegrams", { params })
        .then(({ data: response }) => response as BasePaginateRes<TgLinkTypes>),
    enabled,
    refetchOnMount: true,
  });
};
export default useTgLinks;
