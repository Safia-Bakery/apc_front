import { useQuery } from "@tanstack/react-query";
import baseApi from "@/api/base_api";
import { CommentTypes } from "@/utils/types";

export const useComments = ({
  enabled = true,
  size,
  page = 1,
}: {
  enabled?: boolean;
  size?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ["comments", page],
    queryFn: () =>
      baseApi
        .get("/v1/comments", { params: { size, page } })
        .then(({ data: response }) => response as CommentTypes),
    enabled,
    refetchOnMount: true,
  });
};
export default useComments;
